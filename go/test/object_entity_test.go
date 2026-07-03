package sdktest

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/real-rest-sdk/go"
	"github.com/voxgig-sdk/real-rest-sdk/go/core"

	vs "github.com/voxgig-sdk/real-rest-sdk/go/utility/struct"
)

func TestObjectEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Object(nil)
		if ent == nil {
			t.Fatal("expected non-nil ObjectEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := objectBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "object." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set REALREST_TEST_OBJECT_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		objectRef01Ent := client.Object(nil)
		objectRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "object"}, setup.data), "object_ref01"))

		objectRef01DataResult, err := objectRef01Ent.Create(objectRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		objectRef01Data = core.ToMapAny(objectRef01DataResult)
		if objectRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if objectRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		objectRef01Match := map[string]any{}

		objectRef01ListResult, err := objectRef01Ent.List(objectRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		objectRef01List, objectRef01ListOk := objectRef01ListResult.([]any)
		if !objectRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", objectRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(objectRef01List), map[string]any{"id": objectRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		objectRef01DataUp0Up := map[string]any{
			"id": objectRef01Data["id"],
		}

		objectRef01MarkdefUp0Name := "name"
		objectRef01MarkdefUp0Value := fmt.Sprintf("Mark01-object_ref01_%d", setup.now)
		objectRef01DataUp0Up[objectRef01MarkdefUp0Name] = objectRef01MarkdefUp0Value

		objectRef01ResdataUp0Result, err := objectRef01Ent.Update(objectRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		objectRef01ResdataUp0 := core.ToMapAny(objectRef01ResdataUp0Result)
		if objectRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if objectRef01ResdataUp0["id"] != objectRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if objectRef01ResdataUp0[objectRef01MarkdefUp0Name] != objectRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", objectRef01MarkdefUp0Name, objectRef01ResdataUp0[objectRef01MarkdefUp0Name])
		}

		// LOAD
		objectRef01MatchDt0 := map[string]any{
			"id": objectRef01Data["id"],
		}
		objectRef01DataDt0Loaded, err := objectRef01Ent.Load(objectRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		objectRef01DataDt0LoadResult := core.ToMapAny(objectRef01DataDt0Loaded)
		if objectRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if objectRef01DataDt0LoadResult["id"] != objectRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		objectRef01MatchRm0 := map[string]any{
			"id": objectRef01Data["id"],
		}
		_, err = objectRef01Ent.Remove(objectRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		objectRef01MatchRt0 := map[string]any{}

		objectRef01ListRt0Result, err := objectRef01Ent.List(objectRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		objectRef01ListRt0, objectRef01ListRt0Ok := objectRef01ListRt0Result.([]any)
		if !objectRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", objectRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(objectRef01ListRt0), map[string]any{"id": objectRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func objectBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "object", "ObjectTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read object test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse object test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"object01", "object02", "object03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("REALREST_TEST_OBJECT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"REALREST_TEST_OBJECT_ENTID": idmap,
		"REALREST_TEST_LIVE":      "FALSE",
		"REALREST_TEST_EXPLAIN":   "FALSE",
		"REALREST_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["REALREST_TEST_OBJECT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["REALREST_TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
				"apikey": env["REALREST_APIKEY"],
			},
			extra,
		})
		client = sdk.NewRealRestSDK(core.ToMapAny(mergedOpts))
	}

	live := env["REALREST_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["REALREST_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
