# Object entity test

require "minitest/autorun"
require "json"
require_relative "../RealRest_sdk"
require_relative "runner"

class ObjectEntityTest < Minitest::Test
  def test_create_instance
    testsdk = RealRestSDK.test(nil, nil)
    ent = testsdk.Object(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = object_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "list", "update", "load", "remove"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "object." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set REALREST_TEST_OBJECT_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    object_ref01_ent = client.Object(nil)
    object_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.object"), "object_ref01"))

    object_ref01_data_result = object_ref01_ent.create(object_ref01_data, nil)
    object_ref01_data = Helpers.to_map(object_ref01_data_result)
    assert !object_ref01_data.nil?
    assert !object_ref01_data["id"].nil?

    # LIST
    object_ref01_match = {}

    object_ref01_list_result = object_ref01_ent.list(object_ref01_match, nil)
    assert object_ref01_list_result.is_a?(Array)

    found_item = Vs.select(
      Runner.entity_list_to_data(object_ref01_list_result),
      { "id" => object_ref01_data["id"] })
    assert !Vs.isempty(found_item)

    # UPDATE
    object_ref01_data_up0_up = {
      "id" => object_ref01_data["id"],
    }

    object_ref01_markdef_up0_name = "name"
    object_ref01_markdef_up0_value = "Mark01-object_ref01_#{setup[:now]}"
    object_ref01_data_up0_up[object_ref01_markdef_up0_name] = object_ref01_markdef_up0_value

    object_ref01_resdata_up0_result = object_ref01_ent.update(object_ref01_data_up0_up, nil)
    object_ref01_resdata_up0 = Helpers.to_map(object_ref01_resdata_up0_result)
    assert !object_ref01_resdata_up0.nil?
    assert_equal object_ref01_resdata_up0["id"], object_ref01_data_up0_up["id"]
    assert_equal object_ref01_resdata_up0[object_ref01_markdef_up0_name], object_ref01_markdef_up0_value

    # LOAD
    object_ref01_match_dt0 = {
      "id" => object_ref01_data["id"],
    }
    object_ref01_data_dt0_loaded = object_ref01_ent.load(object_ref01_match_dt0, nil)
    object_ref01_data_dt0_load_result = Helpers.to_map(object_ref01_data_dt0_loaded)
    assert !object_ref01_data_dt0_load_result.nil?
    assert_equal object_ref01_data_dt0_load_result["id"], object_ref01_data["id"]

    # REMOVE
    object_ref01_match_rm0 = {
      "id" => object_ref01_data["id"],
    }
    object_ref01_ent.remove(object_ref01_match_rm0, nil)

    # LIST
    object_ref01_match_rt0 = {}

    object_ref01_list_rt0_result = object_ref01_ent.list(object_ref01_match_rt0, nil)
    assert object_ref01_list_rt0_result.is_a?(Array)

    not_found_item = Vs.select(
      Runner.entity_list_to_data(object_ref01_list_rt0_result),
      { "id" => object_ref01_data["id"] })
    assert Vs.isempty(not_found_item)

  end
end

def object_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "object", "ObjectTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = RealRestSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["object01", "object02", "object03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["REALREST_TEST_OBJECT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "REALREST_TEST_OBJECT_ENTID" => idmap,
    "REALREST_TEST_LIVE" => "FALSE",
    "REALREST_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["REALREST_TEST_OBJECT_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["REALREST_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      {
      },
      extra || {},
    ])
    client = RealRestSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["REALREST_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["REALREST_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
