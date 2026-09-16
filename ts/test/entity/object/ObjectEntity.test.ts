

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { RealRestSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
loadEnvLocal(__dirname + '/../../../.env.local')


describe('ObjectEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when REAL_REST_TEST_LIVE=TRUE.
  afterEach(liveDelay('REAL_REST_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = RealRestSDK.test()
    const ent = testsdk.Object()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.REAL_REST_TEST_LIVE
    for (const op of ['create', 'list', 'update', 'load', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'object.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"data","req":false,"short":"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)","type":"`$OBJECT`","index$":0},{"active":true,"name":"id","op":{"list":{"req":true,"type":"`$STRING`"}},"req":false,"short":"Unique identifier for the object","type":"`$STRING`","index$":1},{"active":true,"name":"name","op":{"create":{"req":true,"type":"`$STRING`"},"list":{"req":true,"type":"`$STRING`"},"patch":{"req":true,"type":"`$STRING`"},"update":{"req":true,"type":"`$STRING`"}},"req":false,"short":"Name of the object","type":"`$STRING`","index$":2}],"id":{"field":"id","name":"id"},"name":"object","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{},"contract":{"id":"POST /objects","json":"{\"operationId\":\"createObject\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"example\":{\"data\":{\"Capacity\":\"256 GB\",\"Generation\":\"4th\",\"Price\":\"519.99\"},\"name\":\"Apple iPad Air\"},\"schema\":{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)\",\"nullable\":true,\"type\":\"object\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"name\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"example\":{\"createdAt\":\"2022-11-21T20:06:23.986Z\",\"data\":{\"Capacity\":\"256 GB\",\"Generation\":\"4th\",\"Price\":\"519.99\"},\"id\":\"13\",\"name\":\"Apple iPad Air\"},\"schema\":{\"allOf\":[{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types\",\"nullable\":true,\"type\":\"object\"},\"id\":{\"description\":\"Unique identifier for the object\",\"type\":\"string\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"id\",\"name\"],\"type\":\"object\"},{\"properties\":{\"createdAt\":{\"description\":\"Timestamp when the object was created\",\"format\":\"date-time\",\"type\":\"string\"}},\"type\":\"object\"}]}}},\"description\":\"Object created successfully\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/objects","segments":[{"lit":"objects"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"active":true,"args":{"query":[{"active":true,"example":"1,2,3","kind":"query","name":"id","orig":"id","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"GET /objects?id={ids}","json":"{\"operationId\":\"getObjectsByIds\",\"parameters\":[{\"description\":\"Comma-separated list of object IDs to retrieve\",\"example\":\"1,2,3\",\"in\":\"query\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"items\":{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types\",\"nullable\":true,\"type\":\"object\"},\"id\":{\"description\":\"Unique identifier for the object\",\"type\":\"string\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"id\",\"name\"],\"type\":\"object\"},\"type\":\"array\"}}},\"description\":\"Successful response with list of requested objects\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/objects?id={ids}","segments":[{"lit":"objects?id={ids}"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0},{"active":true,"args":{},"contract":{"id":"GET /objects","json":"{\"operationId\":\"listAllObjects\",\"parameters\":[],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"example\":[{\"data\":{\"capacity\":\"128 GB\",\"color\":\"Cloudy White\"},\"id\":\"1\",\"name\":\"Google Pixel 6 Pro\"},{\"data\":null,\"id\":\"2\",\"name\":\"Apple iPhone 12 Mini, 256GB, Blue\"}],\"schema\":{\"items\":{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types\",\"nullable\":true,\"type\":\"object\"},\"id\":{\"description\":\"Unique identifier for the object\",\"type\":\"string\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"id\",\"name\"],\"type\":\"object\"},\"type\":\"array\"}}},\"description\":\"Successful response with list of objects\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/objects","segments":[{"lit":"objects"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"active":true,"args":{"params":[{"active":true,"example":"4","kind":"param","name":"id","orig":"id","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"GET /objects/{id}","json":"{\"operationId\":\"getObjectById\",\"parameters\":[{\"description\":\"The ID of the object to retrieve\",\"example\":\"4\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"example\":{\"data\":{\"color\":\"Purple\",\"price\":389.99},\"id\":\"4\",\"name\":\"Apple iPhone 11, 64GB\"},\"schema\":{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types\",\"nullable\":true,\"type\":\"object\"},\"id\":{\"description\":\"Unique identifier for the object\",\"type\":\"string\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"id\",\"name\"],\"type\":\"object\"}}},\"description\":\"Successful response with object data\"},\"404\":{\"description\":\"Object not found\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/objects/{id}","segments":[{"lit":"objects"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"},"patch":{"input":"data","name":"patch","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"id","orig":"id","reqd":true,"type":"`$STRING`"}]},"contract":{"id":"PATCH /objects/{id}","json":"{\"operationId\":\"partialUpdateObject\",\"parameters\":[{\"description\":\"The ID of the object to partially update\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"example\":{\"data\":{\"price\":140},\"name\":\"Apple AirPods (Updated)\"},\"schema\":{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)\",\"nullable\":true,\"type\":\"object\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"name\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"allOf\":[{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types\",\"nullable\":true,\"type\":\"object\"},\"id\":{\"description\":\"Unique identifier for the object\",\"type\":\"string\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"id\",\"name\"],\"type\":\"object\"},{\"properties\":{\"updatedAt\":{\"description\":\"Timestamp when the object was last updated\",\"format\":\"date-time\",\"type\":\"string\"}},\"type\":\"object\"}]}}},\"description\":\"Object partially updated successfully\"},\"404\":{\"description\":\"Object not found\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"PATCH","orig":"/objects/{id}","segments":[{"lit":"objects"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"patch"},"remove":{"input":"data","name":"remove","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"id","orig":"id","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"DELETE /objects/{id}","json":"{\"operationId\":\"deleteObject\",\"parameters\":[{\"description\":\"The ID of the object to delete\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"message\":{\"example\":\"Object deleted successfully\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Object deleted successfully\"},\"404\":{\"description\":\"Object not found\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"DELETE","orig":"/objects/{id}","segments":[{"lit":"objects"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"},"update":{"input":"data","name":"update","points":[{"active":true,"args":{"params":[{"active":true,"example":"6","kind":"param","name":"id","orig":"id","reqd":true,"type":"`$STRING`","index$":0}]},"contract":{"id":"PUT /objects/{id}","json":"{\"operationId\":\"updateObject\",\"parameters\":[{\"description\":\"The ID of the object to update\",\"example\":\"6\",\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"example\":{\"data\":{\"color\":\"white\",\"generation\":\"3rd\",\"price\":135},\"name\":\"Apple AirPods\"},\"schema\":{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)\",\"nullable\":true,\"type\":\"object\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"name\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"example\":{\"data\":{\"color\":\"white\",\"generation\":\"3rd\",\"price\":135},\"id\":\"6\",\"name\":\"Apple AirPods\",\"updatedAt\":\"2022-11-21T20:06:23.986Z\"},\"schema\":{\"allOf\":[{\"properties\":{\"data\":{\"additionalProperties\":true,\"description\":\"Flexible JSON object containing custom attributes of various types\",\"nullable\":true,\"type\":\"object\"},\"id\":{\"description\":\"Unique identifier for the object\",\"type\":\"string\"},\"name\":{\"description\":\"Name of the object\",\"type\":\"string\"}},\"required\":[\"id\",\"name\"],\"type\":\"object\"},{\"properties\":{\"updatedAt\":{\"description\":\"Timestamp when the object was last updated\",\"format\":\"date-time\",\"type\":\"string\"}},\"type\":\"object\"}]}}},\"description\":\"Object updated successfully\"},\"404\":{\"description\":\"Object not found\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"PUT","orig":"/objects/{id}","segments":[{"lit":"objects"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"object","name__orig":"object","Name":"Object","name_":"object","name-":"object","NAME":"OBJECT","index$":0}, {"active":true,"entity":"object","key$":"BasicObjectFlow","kind":"basic","name":"BasicObjectFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"object_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0},{"active":true,"data":{},"input":{},"match":{},"op":"list","spec":[],"valid":[{"apply":"ItemExists","def":{"ref":"object_ref01"}}],"index$":1},{"active":true,"data":{},"input":{"ref":"object_ref01","srcdatavar":"object_ref01_data","suffix":"_up0","textfield":"name"},"match":{},"op":"update","spec":[{"apply":"TextFieldMark","def":{"mark":"Mark01-object_ref01"}}],"valid":[],"index$":2},{"active":true,"data":{},"input":{"ref":"object_ref01","srcdatavar":"object_ref01_data","suffix":"_dt0"},"match":{"id":"object01"},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-object_ref01"}}],"index$":3},{"active":true,"data":{},"input":{"ref":"object_ref01","suffix":"_rm0"},"match":{"id":"object01"},"op":"remove","spec":[],"valid":[],"index$":4},{"active":true,"data":{},"input":{"suffix":"_rt0"},"match":{},"op":"list","spec":[],"valid":[{"apply":"ItemNotExists","def":{"ref":"object_ref01"}}],"index$":5}]}, 'Object')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const object_ref01_ent = client.Object()
    let object_ref01_data = setup.data.new.object['object_ref01']

    object_ref01_data = (await object_ref01_ent.create(object_ref01_data)).data()
    assert(null != object_ref01_data.id)


    // LIST
    const object_ref01_match: any = {}

    const object_ref01_list = (await object_ref01_ent.list(object_ref01_match)).map((e: any) => e.data())

    assert(!isempty(select(object_ref01_list, { id: object_ref01_data.id })))


    // UPDATE
    const object_ref01_data_up0: any = {}
    object_ref01_data_up0.id = object_ref01_data.id

    const object_ref01_markdef_up0 = { name: 'name', value: 'Mark01-object_ref01_' + setup.now }
    ;(object_ref01_data_up0 as any)[object_ref01_markdef_up0.name] = object_ref01_markdef_up0.value

    const object_ref01_resdata_up0 = (await object_ref01_ent.update(object_ref01_data_up0)).data()
    assert(object_ref01_resdata_up0.id === object_ref01_data_up0.id)

    assert((object_ref01_resdata_up0 as any)[object_ref01_markdef_up0.name] === object_ref01_markdef_up0.value)


    // LOAD
    const object_ref01_match_dt0: any = {}
    object_ref01_match_dt0.id = object_ref01_data.id
    const object_ref01_data_dt0 = (await object_ref01_ent.load(object_ref01_match_dt0)).data()
    assert(object_ref01_data_dt0.id === object_ref01_data.id)


    // REMOVE
    const object_ref01_match_rm0: any = { id: object_ref01_data.id }
    await object_ref01_ent.remove(object_ref01_match_rm0)
  

    // LIST
    const object_ref01_match_rt0: any = {}

    const object_ref01_list_rt0 = (await object_ref01_ent.list(object_ref01_match_rt0)).map((e: any) => e.data())

    assert(isempty(select(object_ref01_list_rt0, { id: object_ref01_data.id })))


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/object/ObjectTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = RealRestSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['object01','object02','object03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'REAL_REST_TEST_OBJECT_ENTID': idmap,
    'REAL_REST_TEST_LIVE': 'FALSE',
    'REAL_REST_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['REAL_REST_TEST_OBJECT_ENTID']

  const live = 'TRUE' === env.REAL_REST_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['REAL_REST_TEST_OBJECT_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new RealRestSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
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
  }

  return setup
}
  
