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

// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const objectEntityLiveStrict = true


type objectFailHook struct {
	sdk.BaseFeature
	unexpected int
}

func (f *objectFailHook) PreSpec(ctx *sdk.Context) {
	panic("object hook failed")
}

func (f *objectFailHook) PreUnexpected(ctx *sdk.Context) {
	f.unexpected++
}

func TestObjectEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Object(nil)
		if ent == nil {
			t.Fatal("expected non-nil ObjectEntity")
		}
	})

	// Feature #4: the entity Stream(action, ...) method runs the op pipeline and
	// returns a channel over result items. With the streaming feature active it
	// yields the feature's incremental output; otherwise it falls back to the
	// materialised list so Stream always yields.
	t.Run("stream", func(t *testing.T) {
		seed := map[string]any{
			"entity": map[string]any{
				"object": map[string]any{
					"s1": map[string]any{"id": "s1"},
					"s2": map[string]any{"id": "s2"},
					"s3": map[string]any{"id": "s3"},
				},
			},
		}

		// Fallback: streaming inactive -> yields the materialised list items.
		base := sdk.TestSDK(seed, nil)
		var seen []any
		for si := range base.Object(nil).Stream("list", nil, nil) {
			if si.Err != nil {
				t.Fatalf("stream failed: %v", si.Err)
			}
			seen = append(seen, si.Item)
		}
		if len(seen) != 3 {
			t.Fatalf("expected 3 streamed items, got %d", len(seen))
		}

		// Inbound: streaming active -> yields each item from the feature iterator.
		hasStreaming := false
		if fm, ok := core.SharedConfig()["feature"].(map[string]any); ok {
			_, hasStreaming = fm["streaming"]
		}
		if hasStreaming {
			streamSdk := sdk.TestSDK(seed, map[string]any{
				"feature": map[string]any{"streaming": map[string]any{"active": true}},
			})
			var got []any
			for si := range streamSdk.Object(nil).Stream("list", nil, nil) {
				if si.Err != nil {
					t.Fatalf("stream failed: %v", si.Err)
				}
				if sub, ok := si.Item.([]any); ok {
					got = append(got, sub...)
				} else {
					got = append(got, si.Item)
				}
			}
			if len(got) != 3 {
				t.Fatalf("expected 3 items via streaming feature, got %d", len(got))
			}
		}
	})

	t.Run("stream-error", func(t *testing.T) {
		offline := map[string]any{"net": map[string]any{"offline": true}}
		var streamerr error
		for si := range sdk.TestSDK(offline, nil).Object(nil).Stream("list", nil, nil) {
			if si.Err != nil {
				streamerr = si.Err
			}
		}
		if nil == streamerr || !strings.Contains(streamerr.Error(), "offline") {
			t.Fatalf("expected the transport failure as a stream value, got %v", streamerr)
		}

		quiet := map[string]any{"ctrl": map[string]any{"throw": false}}
		for si := range sdk.TestSDK(offline, nil).Object(nil).Stream("list", nil, quiet) {
			if si.Err != nil {
				t.Fatalf("throw false: expected no error value, got %v", si.Err)
			}
		}

		if fhHasFeature("rbac") {
			denied := sdk.TestSDK(nil, map[string]any{
				"feature": map[string]any{"rbac": map[string]any{"active": true, "deny": true}},
			})
			var denyerr error
			for si := range denied.Object(nil).Stream("list", nil, nil) {
				if si.Err != nil {
					denyerr = si.Err
				}
			}
			if sdkerr, ok := denyerr.(*core.RealRestError); !ok || "rbac_denied" != sdkerr.Code {
				t.Fatalf("expected the rbac denial as a stream value, got %v", denyerr)
			}
		}
	})

	t.Run("stream-ctrl", func(t *testing.T) {
		explain := map[string]any{}
		ctrl := map[string]any{"explain": explain}
		for range sdk.TestSDK(nil, nil).Object(nil).Stream("list", nil, map[string]any{"ctrl": ctrl}) {
		}
		if _, has := ctrl["stream"]; has || 1 != len(ctrl) {
			t.Fatalf("the stream changed the caller's ctrl")
		}
		if 0 == len(explain) {
			t.Fatalf("the caller's explain record was not filled")
		}
	})

	t.Run("unexpected", func(t *testing.T) {
		hook := &objectFailHook{
			BaseFeature: sdk.BaseFeature{Version: "0.0.1", Name: "failhook", Active: true}}
		client := sdk.TestSDK(nil, map[string]any{"extend": []any{hook}})

		_, err := client.Object(nil).List(nil, nil)
		if nil == err || !strings.Contains(err.Error(), "hook failed") {
			t.Fatalf("expected the hook's failure, got %v", err)
		}
		if 0 == hook.unexpected {
			t.Fatalf("PreUnexpected did not fire")
		}

		fired := hook.unexpected
		if _, err := client.Object(nil).List(nil, map[string]any{"throw": false}); nil != err {
			t.Fatalf("throw false: expected no error, got %v", err)
		}
		if fired == hook.unexpected {
			t.Fatalf("throw false: PreUnexpected did not fire")
		}
	})

	t.Run("validate", func(t *testing.T) {
		if !fhHasFeature("validate") {
			t.Skip("feature not present in this SDK: validate")
		}
		client := sdk.TestSDK(nil, map[string]any{
			"feature": map[string]any{"validate": map[string]any{"active": true}},
		})
		_, err := client.Object(nil).List(map[string]any{"ids": 1, "id": "x"}, nil)
		if sdkerr, ok := err.(*core.RealRestError); !ok || "validate_failed" != sdkerr.Code {
			t.Fatalf("expected validate_failed, got %v", err)
		}
	})

	t.Run("basic", func(tt *testing.T) {
		var t testing.TB = tt
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
		if setup.live {
			for _, _liveKey := range []string{"ids01"} {
				if setup.syntheticOnly || setup.idmap[_liveKey] == nil {
					liveMiss(t, objectEntityLiveStrict, "Live entity test blocked: needs %s via REAL_REST_TEST_OBJECT_ENTID", _liveKey)
				}
			}
		}
		client := setup.client
		_ = client

		// CREATE
		objectRef01Ent := client.Object(nil)
		objectRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath(setup.data, []any{"new", "object"}), "object_ref01"))
		objectRef01Data["ids"] = setup.idmap["ids01"]

		objectRef01DataResult, err := objectRef01Ent.Create(objectRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		objectRef01Data = core.ToMapAny(entityData(objectRef01DataResult))
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

		objectRef01MarkdefUp0Name := "createdAt"
		objectRef01MarkdefUp0Value := fmt.Sprintf("Mark01-object_ref01_%d", setup.now)
		objectRef01DataUp0Up[objectRef01MarkdefUp0Name] = objectRef01MarkdefUp0Value

		objectRef01ResdataUp0Result, err := objectRef01Ent.Update(objectRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		objectRef01ResdataUp0 := core.ToMapAny(entityData(objectRef01ResdataUp0Result))
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
		objectRef01DataDt0LoadResult := core.ToMapAny(entityData(objectRef01DataDt0Loaded))
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
	idmap, _ := vs.Transform(
		[]any{"object01", "object02", "object03", "ids01"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Whether *_ENTID supplied the idmap, read before envOverride consumes it:
	// without it, the ids a live flow binds are the fixture's synthetic ones.
	entidEnvRaw := os.Getenv("REAL_REST_TEST_OBJECT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"REAL_REST_TEST_OBJECT_ENTID": idmap,
		"REAL_REST_TEST_LIVE":      "FALSE",
		"REAL_REST_TEST_EXPLAIN":   "FALSE",
	})

	idmapResolved := core.ToMapAny(env["REAL_REST_TEST_OBJECT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["REAL_REST_TEST_LIVE"] == "TRUE" {
		// An empty map, not a nil one: Merge returns nil when its last entry
		// is nil, and BasicSetup is normally called with no extras - so a
		// bare nil silently discarded the apikey and server values below.
		extraOpts := extra
		if extraOpts == nil {
			extraOpts = map[string]any{}
		}

		mergedOpts := vs.Merge([]any{
			// liveClientOptions() FIRST, so the generated fields below win:
			// sdk-test-control.json's test.client.options adds to the live
			// client, it does not redirect it.
			liveClientOptions(),
			map[string]any{
			},
			extraOpts,
		})
		client = sdk.NewRealRestSDK(core.ToMapAny(mergedOpts))
	}

	live := env["REAL_REST_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["REAL_REST_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
