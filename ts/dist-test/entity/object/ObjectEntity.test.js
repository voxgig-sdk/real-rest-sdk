"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('ObjectEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when REAL_REST_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('REAL_REST_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.RealRestSDK.test();
        const ent = testsdk.Object();
        (0, node_assert_1.default)(null != ent);
    });
    class FailHook extends __1.BaseFeature {
        name = 'failhook';
        version = '0.0.1';
        active = true;
        unexpected = 0;
        init() { }
        PreSpec() { throw new Error('object hook failed'); }
        PreUnexpected() { this.unexpected++; }
    }
    (0, node_test_1.test)('stream-error', async () => {
        const offline = { net: { offline: true } };
        await node_assert_1.default.rejects(async () => {
            for await (const _item of __1.RealRestSDK.test(offline).Object().stream('list')) { }
        }, /offline/);
        for await (const _item of __1.RealRestSDK.test(offline).Object()
            .stream('list', undefined, { ctrl: { throw: false } })) { }
        if (null != __1.config.feature?.rbac) {
            const denied = __1.RealRestSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } });
            await node_assert_1.default.rejects(async () => {
                for await (const _item of denied.Object().stream('list')) { }
            }, (err) => 'rbac_denied' === err.code);
        }
    });
    (0, node_test_1.test)('stream-ctrl', async () => {
        const explain = {};
        const ctrl = { explain };
        for await (const _item of __1.RealRestSDK.test().Object().stream('list', undefined, { ctrl })) { }
        node_assert_1.default.deepStrictEqual(Object.keys(ctrl), ['explain']);
        (0, node_assert_1.default)(explain === ctrl.explain && 0 < Object.keys(explain).length);
    });
    (0, node_test_1.test)('unexpected', async () => {
        const hook = new FailHook();
        const client = new __1.RealRestSDK({ feature: { test: { active: true } }, extend: [hook] });
        await node_assert_1.default.rejects(client.Object().list(), /hook failed/);
        (0, node_assert_1.default)(0 < hook.unexpected);
        const fired = hook.unexpected;
        node_assert_1.default.strictEqual(await client.Object().list(undefined, { throw: false }), undefined);
        (0, node_assert_1.default)(fired < hook.unexpected);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.RealRestSDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Object().list({ "ids": 1, "id": "x" }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.REAL_REST_TEST_LIVE;
        for (const op of ['create', 'list', 'update', 'load', 'remove']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'object.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "createdAt": { "a": true, "fo": "date-time", "h": "Created At", "n": "createdAt", "r": false, "sh": "Timestamp when the object was created", "t": "`$STRING`", "key$": "createdAt", "index$": 0 }, "data": { "a": true, "h": "Data", "n": "data", "r": false, "sh": "Flexible JSON object containing custom attributes of various types", "t": "`$OBJECT`", "key$": "data", "index$": 1 }, "id": { "a": true, "h": "Id", "n": "id", "r": true, "sh": "Unique identifier for the object", "t": "`$STRING`", "key$": "id", "index$": 2 }, "name": { "a": true, "h": "Name", "n": "name", "r": true, "sh": "Name of the object", "t": "`$STRING`", "key$": "name", "index$": 3 }, "updatedAt": { "a": true, "fo": "date-time", "h": "Updated At", "n": "updatedAt", "r": false, "sh": "Timestamp when the object was last updated", "t": "`$STRING`", "key$": "updatedAt", "index$": 4 } }, "id": { "field": "id", "name": "id" }, "name": "object", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "bf": ["data", "name"], "co": { "id": "POST /objects", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "POST", "o": "/objects", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "objects" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" }, "list": { "input": "data", "name": "list", "points": [{ "a": true, "co": { "id": "GET /objects?id={ids}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "ids", "or": "ids", "r": true, "t": "`$STRING`", "index$": 0 }], "query": [{ "a": true, "ex": "1,2,3", "k": "query", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/objects?id={ids}", "q": { "exist": ["id", "ids"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "objects?id={ids}" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }, { "a": true, "co": { "id": "GET /objects", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "GET", "o": "/objects", "q": {}, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "objects" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 1 }], "key$": "list" }, "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /objects/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "ex": "4", "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/objects/{id}", "q": { "exist": ["id"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "objects" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" }, "patch": { "input": "data", "name": "patch", "points": [{ "a": true, "bf": ["data", "name"], "co": { "id": "PATCH /objects/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "PATCH", "o": "/objects/{id}", "q": { "exist": ["id"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "objects" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "patch" }, "remove": { "input": "data", "name": "remove", "points": [{ "a": true, "co": { "id": "DELETE /objects/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "DELETE", "o": "/objects/{id}", "q": { "exist": ["id"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "objects" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" }, "update": { "input": "data", "name": "update", "points": [{ "a": true, "bf": ["data", "name"], "co": { "id": "PUT /objects/{id}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "ex": "6", "k": "param", "n": "id", "or": "id", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "PUT", "o": "/objects/{id}", "q": { "exist": ["id"] }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "objects" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "update" } }, "relations": { "ancestors": [] }, "key$": "object", "name__orig": "object", "Name": "Object", "name_": "object", "name-": "object", "NAME": "OBJECT", "index$": 0 }, { "active": true, "entity": "object", "key$": "BasicObjectFlow", "kind": "basic", "name": "BasicObjectFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "object_ref01" }, "m": { "ids": "ids01" }, "o": "create", "s": [], "v": [], "index$": 0 }, { "a": true, "d": {}, "i": {}, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemExists", "def": { "ref": "object_ref01" } }], "index$": 1 }, { "a": true, "d": {}, "i": { "ref": "object_ref01", "srcdatavar": "object_ref01_data", "suffix": "_up0", "textfield": "createdAt" }, "m": {}, "o": "update", "s": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-object_ref01" } }], "v": [], "index$": 2 }, { "a": true, "d": {}, "i": { "ref": "object_ref01", "srcdatavar": "object_ref01_data", "suffix": "_dt0" }, "m": { "id": "object01" }, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-object_ref01" } }], "index$": 3 }, { "a": true, "d": {}, "i": { "ref": "object_ref01", "suffix": "_rm0" }, "m": { "id": "object01" }, "o": "remove", "s": [], "v": [], "index$": 4 }, { "a": true, "d": {}, "i": { "suffix": "_rt0" }, "m": {}, "o": "list", "s": [], "v": [{ "apply": "ItemNotExists", "def": { "ref": "object_ref01" } }], "index$": 5 }] }, 'Object', { "POST /objects": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "name": { "type": "string", "description": "Name of the object", "key$": "name" }, "data": { "type": "object", "nullable": true, "description": "Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)", "additionalProperties": true, "key$": "data" } }, "required": ["name"], "x-ref": "#/components/schemas/ObjectInput", "index$": 1 }, "example": { "name": "Apple iPad Air", "data": { "Generation": "4th", "Price": "519.99", "Capacity": "256 GB" } } } } }, "parameters": [] }, "GET /objects?id={ids}": { "protocol": "http", "parameters": [{ "name": "id", "in": "query", "required": true, "description": "Comma-separated list of object IDs to retrieve", "schema": { "type": "string" }, "example": "1,2,3", "index$": 0 }] }, "GET /objects": { "protocol": "http", "parameters": [] }, "GET /objects/{id}": { "protocol": "http", "parameters": [{ "name": "id", "in": "path", "required": true, "description": "The ID of the object to retrieve", "schema": { "type": "string" }, "example": "4", "index$": 0 }] }, "PATCH /objects/{id}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "name": { "type": "string", "description": "Name of the object", "key$": "name" }, "data": { "type": "object", "nullable": true, "description": "Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)", "additionalProperties": true, "key$": "data" } }, "required": ["name"], "x-ref": "#/components/schemas/ObjectInput", "index$": 1 }, "example": { "name": "Apple AirPods (Updated)", "data": { "price": 140 } } } } }, "parameters": [{ "name": "id", "in": "path", "required": true, "description": "The ID of the object to partially update", "schema": { "type": "string" }, "index$": 0 }] }, "DELETE /objects/{id}": { "protocol": "http", "parameters": [{ "name": "id", "in": "path", "required": true, "description": "The ID of the object to delete", "schema": { "type": "string" }, "index$": 0 }] }, "PUT /objects/{id}": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "properties": { "name": { "type": "string", "description": "Name of the object", "key$": "name" }, "data": { "type": "object", "nullable": true, "description": "Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)", "additionalProperties": true, "key$": "data" } }, "required": ["name"], "x-ref": "#/components/schemas/ObjectInput", "index$": 1 }, "example": { "name": "Apple AirPods", "data": { "color": "white", "generation": "3rd", "price": 135 } } } } }, "parameters": [{ "name": "id", "in": "path", "required": true, "description": "The ID of the object to update", "schema": { "type": "string" }, "example": "6", "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const object_ref01_ent = client.Object();
        let object_ref01_data = setup.data.new.object['object_ref01'];
        object_ref01_data['ids'] = setup.idmap['ids01'];
        object_ref01_data = (await object_ref01_ent.create(object_ref01_data)).data();
        (0, node_assert_1.default)(null != object_ref01_data.id);
        // LIST
        const object_ref01_match = {};
        const object_ref01_list = (await object_ref01_ent.list(object_ref01_match)).map((e) => e.data());
        (0, node_assert_1.default)(!isempty(select(object_ref01_list, { id: object_ref01_data.id })));
        // UPDATE
        const object_ref01_data_up0 = {};
        object_ref01_data_up0.id = object_ref01_data.id;
        const object_ref01_markdef_up0 = { name: 'createdAt', value: 'Mark01-object_ref01_' + setup.now };
        object_ref01_data_up0[object_ref01_markdef_up0.name] = object_ref01_markdef_up0.value;
        const object_ref01_resdata_up0 = (await object_ref01_ent.update(object_ref01_data_up0)).data();
        (0, node_assert_1.default)(object_ref01_resdata_up0.id === object_ref01_data_up0.id);
        (0, node_assert_1.default)(object_ref01_resdata_up0[object_ref01_markdef_up0.name] === object_ref01_markdef_up0.value);
        // LOAD
        const object_ref01_match_dt0 = {};
        object_ref01_match_dt0.id = object_ref01_data.id;
        const object_ref01_data_dt0 = (await object_ref01_ent.load(object_ref01_match_dt0)).data();
        (0, node_assert_1.default)(object_ref01_data_dt0.id === object_ref01_data.id);
        // REMOVE
        const object_ref01_match_rm0 = { id: object_ref01_data.id };
        await object_ref01_ent.remove(object_ref01_match_rm0);
        // LIST
        const object_ref01_match_rt0 = {};
        const object_ref01_list_rt0 = (await object_ref01_ent.list(object_ref01_match_rt0)).map((e) => e.data());
        (0, node_assert_1.default)(isempty(select(object_ref01_list_rt0, { id: object_ref01_data.id })));
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/object/ObjectTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.RealRestSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['object01', 'object02', 'object03', 'ids01'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'REAL_REST_TEST_OBJECT_ENTID': idmap,
        'REAL_REST_TEST_LIVE': 'FALSE',
        'REAL_REST_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['REAL_REST_TEST_OBJECT_ENTID'];
    const live = 'TRUE' === env.REAL_REST_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['REAL_REST_TEST_OBJECT_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.RealRestSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {},
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.REAL_REST_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=ObjectEntity.test.js.map