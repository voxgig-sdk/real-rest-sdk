# Object entity test

import json
import os
import time

import pytest

from utility.voxgig_struct import voxgig_struct as vs
from realrest_sdk import RealRestSDK
from core import helpers

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner


class TestObjectEntity:

    def test_should_create_instance(self):
        testsdk = RealRestSDK.test(None, None)
        ent = testsdk.Object(None)
        assert ent is not None

    def test_should_run_basic_flow(self):
        setup = _object_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create", "list", "update", "load", "remove"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "object." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        # The basic flow consumes synthetic IDs from the fixture. In live mode
        # without an *_ENTID env override, those IDs hit the live API and 4xx.
        if setup.get("synthetic_only"):
            pytest.skip("live entity test uses synthetic IDs from fixture — "
                        "set REALREST_TEST_OBJECT_ENTID JSON to run live")
        client = setup["client"]

        # CREATE
        object_ref01_ent = client.Object(None)
        object_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.object"), "object_ref01"))

        object_ref01_data_result, err = object_ref01_ent.create(object_ref01_data, None)
        assert err is None
        object_ref01_data = helpers.to_map(object_ref01_data_result)
        assert object_ref01_data is not None
        assert object_ref01_data["id"] is not None

        # LIST
        object_ref01_match = {}

        object_ref01_list_result, err = object_ref01_ent.list(object_ref01_match, None)
        assert err is None
        assert isinstance(object_ref01_list_result, list)

        found_item = vs.select(
            runner.entity_list_to_data(object_ref01_list_result),
            {"id": object_ref01_data["id"]})
        assert not vs.isempty(found_item)

        # UPDATE
        object_ref01_data_up0_up = {
            "id": object_ref01_data["id"],
        }

        object_ref01_markdef_up0_name = "name"
        object_ref01_markdef_up0_value = "Mark01-object_ref01_" + str(setup["now"])
        object_ref01_data_up0_up[object_ref01_markdef_up0_name] = object_ref01_markdef_up0_value

        object_ref01_resdata_up0_result, err = object_ref01_ent.update(object_ref01_data_up0_up, None)
        assert err is None
        object_ref01_resdata_up0 = helpers.to_map(object_ref01_resdata_up0_result)
        assert object_ref01_resdata_up0 is not None
        assert object_ref01_resdata_up0["id"] == object_ref01_data_up0_up["id"]
        assert object_ref01_resdata_up0[object_ref01_markdef_up0_name] == object_ref01_markdef_up0_value

        # LOAD
        object_ref01_match_dt0 = {
            "id": object_ref01_data["id"],
        }
        object_ref01_data_dt0_loaded, err = object_ref01_ent.load(object_ref01_match_dt0, None)
        assert err is None
        object_ref01_data_dt0_load_result = helpers.to_map(object_ref01_data_dt0_loaded)
        assert object_ref01_data_dt0_load_result is not None
        assert object_ref01_data_dt0_load_result["id"] == object_ref01_data["id"]

        # REMOVE
        object_ref01_match_rm0 = {
            "id": object_ref01_data["id"],
        }
        _, err = object_ref01_ent.remove(object_ref01_match_rm0, None)
        assert err is None

        # LIST
        object_ref01_match_rt0 = {}

        object_ref01_list_rt0_result, err = object_ref01_ent.list(object_ref01_match_rt0, None)
        assert err is None
        assert isinstance(object_ref01_list_rt0_result, list)

        not_found_item = vs.select(
            runner.entity_list_to_data(object_ref01_list_rt0_result),
            {"id": object_ref01_data["id"]})
        assert vs.isempty(not_found_item)



def _object_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/object/ObjectTestData.json")
    with open(entity_data_file, "r") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = RealRestSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["object01", "object02", "object03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Detect ENTID env override before envOverride consumes it. When live
    # mode is on without a real override, the basic test runs against synthetic
    # IDs from the fixture and 4xx's. We surface this so the test can skip.
    _entid_env_raw = os.environ.get(
        "REALREST_TEST_OBJECT_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "REALREST_TEST_OBJECT_ENTID": idmap,
        "REALREST_TEST_LIVE": "FALSE",
        "REALREST_TEST_EXPLAIN": "FALSE",
    })

    idmap_resolved = helpers.to_map(
        env.get("REALREST_TEST_OBJECT_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("REALREST_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            {
            },
            extra or {},
        ])
        client = RealRestSDK(helpers.to_map(merged_opts))

    _live = env.get("REALREST_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("REALREST_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
