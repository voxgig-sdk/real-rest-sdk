<?php
declare(strict_types=1);

// Object entity test

require_once __DIR__ . '/../realrest_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class ObjectEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = RealRestSDK::test(null, null);
        $ent = $testsdk->Object(null);
        $this->assertNotNull($ent);
    }

    // Feature #4: the entity stream(action, ...) method runs the op pipeline
    // and yields result items. With the streaming feature active it yields the
    // feature's incremental output; otherwise it falls back to the materialised
    // list so stream always yields.
    public function test_stream(): void
    {
        $seed = [
            "entity" => [
                "object" => [
                    "s1" => ["id" => "s1"],
                    "s2" => ["id" => "s2"],
                    "s3" => ["id" => "s3"],
                ],
            ],
        ];

        // Fallback: streaming inactive -> yields the materialised list items.
        $base = RealRestSDK::test($seed, null);
        $seen = iterator_to_array($base->Object(null)->stream("list", null, null), false);
        $this->assertCount(3, $seen);

        // Inbound: streaming active -> yields each item from the feature.
        $cfg = RealRestConfig::make_config();
        if (isset($cfg["feature"]) && is_array($cfg["feature"]) && isset($cfg["feature"]["streaming"])) {
            $sdk = RealRestSDK::test($seed, ["feature" => ["streaming" => ["active" => true]]]);
            $got = [];
            foreach ($sdk->Object(null)->stream("list", null, null) as $item) {
                if (is_array($item) && array_is_list($item)) {
                    foreach ($item as $sub) {
                        $got[] = $sub;
                    }
                } else {
                    $got[] = $item;
                }
            }
            $this->assertCount(3, $got);
        }
    }

    public function test_basic_flow(): void
    {
        $setup = object_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "list", "update", "load", "remove"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "object." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set REALREST_TEST_OBJECT_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $object_ref01_ent = $client->Object(null);
        $object_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.object"), "object_ref01"));

        $object_ref01_data_result = $object_ref01_ent->create($object_ref01_data, null);
        $object_ref01_data = Helpers::to_map($object_ref01_data_result);
        $this->assertNotNull($object_ref01_data);
        $this->assertNotNull($object_ref01_data["id"]);

        // LIST
        $object_ref01_match = [];

        $object_ref01_list_result = $object_ref01_ent->list($object_ref01_match, null);
        $this->assertIsArray($object_ref01_list_result);

        $found_item = sdk_select(
            Runner::entity_list_to_data($object_ref01_list_result),
            ["id" => $object_ref01_data["id"]]);
        $this->assertNotEmpty($found_item);

        // UPDATE
        $object_ref01_data_up0_up = [
            "id" => $object_ref01_data["id"],
        ];

        $object_ref01_markdef_up0_name = "name";
        $object_ref01_markdef_up0_value = "Mark01-object_ref01_" . $setup["now"];
        $object_ref01_data_up0_up[$object_ref01_markdef_up0_name] = $object_ref01_markdef_up0_value;

        $object_ref01_resdata_up0_result = $object_ref01_ent->update($object_ref01_data_up0_up, null);
        $object_ref01_resdata_up0 = Helpers::to_map($object_ref01_resdata_up0_result);
        $this->assertNotNull($object_ref01_resdata_up0);
        $this->assertEquals($object_ref01_resdata_up0["id"], $object_ref01_data_up0_up["id"]);
        $this->assertEquals($object_ref01_resdata_up0[$object_ref01_markdef_up0_name], $object_ref01_markdef_up0_value);

        // LOAD
        $object_ref01_match_dt0 = [
            "id" => $object_ref01_data["id"],
        ];
        $object_ref01_data_dt0_loaded = $object_ref01_ent->load($object_ref01_match_dt0, null);
        $object_ref01_data_dt0_load_result = Helpers::to_map($object_ref01_data_dt0_loaded);
        $this->assertNotNull($object_ref01_data_dt0_load_result);
        $this->assertEquals($object_ref01_data_dt0_load_result["id"], $object_ref01_data["id"]);

        // REMOVE
        $object_ref01_match_rm0 = [
            "id" => $object_ref01_data["id"],
        ];
        $object_ref01_ent->remove($object_ref01_match_rm0, null);

        // LIST
        $object_ref01_match_rt0 = [];

        $object_ref01_list_rt0_result = $object_ref01_ent->list($object_ref01_match_rt0, null);
        $this->assertIsArray($object_ref01_list_rt0_result);

        $not_found_item = sdk_select(
            Runner::entity_list_to_data($object_ref01_list_rt0_result),
            ["id" => $object_ref01_data["id"]]);
        $this->assertEmpty($not_found_item);

    }
}

function object_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/object/ObjectTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = RealRestSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["object01", "object02", "object03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("REALREST_TEST_OBJECT_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "REALREST_TEST_OBJECT_ENTID" => $idmap,
        "REALREST_TEST_LIVE" => "FALSE",
        "REALREST_TEST_EXPLAIN" => "FALSE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["REALREST_TEST_OBJECT_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["REALREST_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
            ],
            $extra ?? [],
        ]);
        $client = new RealRestSDK(Helpers::to_map($merged_opts));
    }

    $live = $env["REALREST_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["REALREST_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
