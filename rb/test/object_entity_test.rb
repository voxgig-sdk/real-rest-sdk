# Object entity test

require "minitest/autorun"
require "json"
require_relative "../RealRest_sdk"
require_relative "runner"

class ObjectEntityTest < Minitest::Test
  # main.kit.test.live.strict is true (the default is true): a live
  # request that fails, or a live test missing an input it needs,
  # fails the test.
  # An account with no record for a test to read skips it either way.
  LIVE_STRICT = true

  def test_create_instance
    testsdk = RealRestSDK.test(nil, nil)
    ent = testsdk.Object(nil)
    assert !ent.nil?
  end

  def test_list_entities
    seed = {
      "entity" => {
        "object" => {
          "l1" => { "id" => "l1" },
          "l2" => { "id" => "l2" },
        },
      },
    }
    items = RealRestSDK.test(seed, nil).Object(nil).list(nil, nil)
    # list resolves to one entity per record; data_get reads the record.
    assert_equal 2, items.length
    items.each do |item|
      assert item.respond_to?(:data_get)
      assert item.data_get.is_a?(Hash)
    end
  end

  # Feature #4: the entity stream(action, ...) method runs the op pipeline and
  # returns an Enumerator over result items. With the streaming feature active
  # it yields the feature's incremental output; otherwise it falls back to the
  # materialised list so stream always yields.
  def test_stream
    seed = {
      "entity" => {
        "object" => {
          "s1" => { "id" => "s1" },
          "s2" => { "id" => "s2" },
          "s3" => { "id" => "s3" },
        },
      },
    }

    # Fallback: streaming inactive -> yields the materialised list items.
    base = RealRestSDK.test(seed, nil)
    seen = base.Object(nil).stream("list", nil, nil).to_a
    assert_equal 3, seen.length

    # Inbound: streaming active -> yields each item from the feature.
    cfg = RealRestConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("streaming")
      sdk = RealRestSDK.test(seed, { "feature" => { "streaming" => { "active" => true } } })
      got = []
      sdk.Object(nil).stream("list", nil, nil).each do |item|
        if item.is_a?(Array)
          got.concat(item)
        else
          got << item
        end
      end
      assert_equal 3, got.length
    end
  end

  class FailHook < RealRestBaseFeature
    attr_reader :unexpected

    def initialize
      super()
      @name = "failhook"
      @unexpected = 0
    end

    def PreSpec(ctx)
      raise "object hook failed"
    end

    def PreUnexpected(ctx)
      @unexpected += 1
    end
  end

  def test_stream_error
    offline = { "net" => { "offline" => true } }
    err = assert_raises(StandardError) do
      RealRestSDK.test(offline, nil).Object(nil).stream("list", nil, nil).to_a
    end
    assert_match(/offline/, err.message)

    RealRestSDK.test(offline, nil).Object(nil)
      .stream("list", nil, { "ctrl" => { "throw" => false } }).to_a

    cfg = RealRestConfig.shared_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("rbac")
      denied = RealRestSDK.test(nil, { "feature" => { "rbac" => { "active" => true, "deny" => true } } })
      err = assert_raises(StandardError) do
        denied.Object(nil).stream("list", nil, nil).to_a
      end
      assert_equal "rbac_denied", err.code
    end
  end

  def test_stream_ctrl
    explain = {}
    ctrl = { "explain" => explain }
    RealRestSDK.test(nil, nil).Object(nil).stream("list", nil, { "ctrl" => ctrl }).to_a
    assert_equal ["explain"], ctrl.keys
    assert_same explain, ctrl["explain"]
    refute_empty explain
  end

  def test_unexpected
    hook = FailHook.new
    client = RealRestSDK.new({ "feature" => { "test" => { "active" => true } }, "extend" => [hook] })

    err = assert_raises(StandardError) do
      client.Object(nil).list(nil, nil)
    end
    assert_match(/hook failed/, err.message)
    assert_operator hook.unexpected, :>, 0

    fired = hook.unexpected
    assert_nil client.Object(nil).list(nil, { "throw" => false })
    assert_operator hook.unexpected, :>, fired
  end

  def test_validate_list_response
    cfg = RealRestConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    opts = { "feature" => { "validate" => { "active" => true, "request" => false, "response" => true } } }
    listed = RealRestSDK.test({ "entity" => { "object" => { "v1" => { "name" => "x" } } } }, opts).Object(nil).list(nil, nil)
    assert_equal ["v1"], listed.map { |ent| ent.data_get["id"] }
    err = assert_raises(StandardError) do
      RealRestSDK.test({ "entity" => { "object" => { "v1" => { "name" => "x", "createdAt" => 1 } } } }, opts).Object(nil).list(nil, nil)
    end
    assert_equal "validate_failed", err.code
  end

  def test_validate
    cfg = RealRestConfig.shared_config
    unless cfg["feature"].is_a?(Hash) && cfg["feature"].key?("validate")
      skip("feature not present in this SDK: validate")
    end
    client = RealRestSDK.test(nil, { "feature" => { "validate" => { "active" => true } } })
    err = assert_raises(StandardError) do
      client.Object(nil).list({ "ids" => 1, "id" => "x" }, nil)
    end
    assert_equal "validate_failed", err.code
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
    if setup[:live]
      ["ids01"].each do |_live_key|
        if setup[:synthetic_only] || setup[:idmap][_live_key].nil?
          Runner.live_miss(LIVE_STRICT, "Live entity test blocked: needs #{_live_key} via REAL_REST_TEST_OBJECT_ENTID")
        end
      end
    end
    client = setup[:client]

    # CREATE
    object_ref01_ent = client.Object(nil)
    object_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.object"), "object_ref01"))
    object_ref01_data["ids"] = setup[:idmap]["ids01"]

    object_ref01_data_result = object_ref01_ent.create(object_ref01_data, nil)
    object_ref01_data = Helpers.to_map(object_ref01_data_result.respond_to?(:data_get) ? object_ref01_data_result.data_get : object_ref01_data_result)
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

    object_ref01_markdef_up0_name = "createdAt"
    object_ref01_markdef_up0_value = "Mark01-object_ref01_#{setup[:now]}"
    object_ref01_data_up0_up[object_ref01_markdef_up0_name] = object_ref01_markdef_up0_value

    object_ref01_resdata_up0_result = object_ref01_ent.update(object_ref01_data_up0_up, nil)
    object_ref01_resdata_up0 = Helpers.to_map(object_ref01_resdata_up0_result.respond_to?(:data_get) ? object_ref01_resdata_up0_result.data_get : object_ref01_resdata_up0_result)
    assert !object_ref01_resdata_up0.nil?
    assert_equal object_ref01_resdata_up0["id"], object_ref01_data_up0_up["id"]
    assert_equal object_ref01_resdata_up0[object_ref01_markdef_up0_name], object_ref01_markdef_up0_value

    # LOAD
    object_ref01_match_dt0 = {
      "id" => object_ref01_data["id"],
    }
    object_ref01_data_dt0_loaded = object_ref01_ent.load(object_ref01_match_dt0, nil)
    object_ref01_data_dt0_load_result = Helpers.to_map(object_ref01_data_dt0_loaded.respond_to?(:data_get) ? object_ref01_data_dt0_loaded.data_get : object_ref01_data_dt0_loaded)
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
  entity_data_source = File.read(entity_data_file, encoding: "UTF-8")
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = RealRestSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["object01", "object02", "object03", "ids01"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Whether *_ENTID supplied the idmap, read before env_override consumes
  # it: without it, the ids a live flow binds are the fixture's synthetic ones.
  entid_env_raw = ENV["REAL_REST_TEST_OBJECT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "REAL_REST_TEST_OBJECT_ENTID" => idmap,
    "REAL_REST_TEST_LIVE" => "FALSE",
    "REAL_REST_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["REAL_REST_TEST_OBJECT_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["REAL_REST_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      # FIRST, so the generated fields below win: sdk-test-control.json's
      # test.client.options adds to the live client, it does not redirect it.
      Runner.live_client_options,
      {
      },
      extra || {},
    ])
    client = RealRestSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["REAL_REST_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["REAL_REST_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
