

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
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"data":{"a":true,"h":"Data","n":"data","r":false,"sh":"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)","t":"`$OBJECT`","key$":"data","index$":0},"id":{"a":true,"h":"Id","n":"id","op":{"list":{"req":true,"type":"`$STRING`"}},"r":false,"sh":"Unique identifier for the object","t":"`$STRING`","key$":"id","index$":1},"name":{"a":true,"h":"Name","n":"name","op":{"create":{"req":true,"type":"`$STRING`"},"list":{"req":true,"type":"`$STRING`"},"patch":{"req":true,"type":"`$STRING`"},"update":{"req":true,"type":"`$STRING`"}},"r":false,"sh":"Name of the object","t":"`$STRING`","key$":"name","index$":2}},"id":{"field":"id","name":"id"},"name":"object","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /objects","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/objects","q":{},"r":{},"s":[{"lit":"objects"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /objects?id={ids}","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"1,2,3","k":"query","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/objects?id={ids}","q":{"exist":["id"]},"r":{},"s":[{"lit":"objects?id={ids}"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"GET /objects","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/objects","q":{},"r":{},"s":[{"lit":"objects"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /objects/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"4","k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/objects/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"objects"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body.data`"},"index$":0}],"key$":"load"},"patch":{"input":"data","name":"patch","points":[{"a":true,"co":{"id":"PATCH /objects/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"PATCH","o":"/objects/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"objects"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"patch"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /objects/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"DELETE","o":"/objects/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"objects"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"},"update":{"input":"data","name":"update","points":[{"a":true,"co":{"id":"PUT /objects/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"ex":"6","k":"param","n":"id","or":"id","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"PUT","o":"/objects/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"objects"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"object","name__orig":"object","Name":"Object","name_":"object","name-":"object","NAME":"OBJECT","index$":0}, {"active":true,"entity":"object","key$":"BasicObjectFlow","kind":"basic","name":"BasicObjectFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"object_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"object_ref01"}}],"index$":1},{"a":true,"d":{},"i":{"ref":"object_ref01","srcdatavar":"object_ref01_data","suffix":"_up0","textfield":"name"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-object_ref01"}}],"v":[],"index$":2},{"a":true,"d":{},"i":{"ref":"object_ref01","srcdatavar":"object_ref01_data","suffix":"_dt0"},"m":{"id":"object01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-object_ref01"}}],"index$":3},{"a":true,"d":{},"i":{"ref":"object_ref01","suffix":"_rm0"},"m":{"id":"object01"},"o":"remove","s":[],"v":[],"index$":4},{"a":true,"d":{},"i":{"suffix":"_rt0"},"m":{},"o":"list","s":[],"v":[{"apply":"ItemNotExists","def":{"ref":"object_ref01"}}],"index$":5}]}, 'Object', {"POST /objects":{"protocol":"http","operationId":"createObject","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)","additionalProperties":true,"key$":"data"}},"required":["name"],"x-ref":"#/components/schemas/ObjectInput","index$":1},"example":{"name":"Apple iPad Air","data":{"Generation":"4th","Price":"519.99","Capacity":"256 GB"}}}}},"responses":{"200":{"description":"Object created successfully","content":{"application/json":{"schema":{"allOf":[{"type":"object","properties":{"id":{"type":"string","description":"Unique identifier for the object","key$":"id"},"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types","additionalProperties":true,"key$":"data"}},"required":["id","name"],"x-ref":"#/components/schemas/Object"},{"type":"object","properties":{"createdAt":{"type":"string","format":"date-time","description":"Timestamp when the object was created"}}}],"x-ref":"#/components/schemas/ObjectWithTimestamp","index$":0},"example":{"id":"13","name":"Apple iPad Air","data":{"Generation":"4th","Price":"519.99","Capacity":"256 GB"},"createdAt":"2022-11-21T20:06:23.986Z"}}}}},"parameters":[],"securitySource":"unspecified"},"GET /objects?id={ids}":{"protocol":"http","operationId":"getObjectsByIds","responses":{"200":{"description":"Successful response with list of requested objects","content":{"application/json":{"schema":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string","description":"Unique identifier for the object","key$":"id"},"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types","additionalProperties":true,"key$":"data"}},"required":["id","name"],"x-ref":"#/components/schemas/Object","index$":0}}}}}},"parameters":[{"name":"id","in":"query","required":true,"description":"Comma-separated list of object IDs to retrieve","schema":{"type":"string"},"example":"1,2,3","index$":0}],"securitySource":"unspecified"},"GET /objects":{"protocol":"http","operationId":"listAllObjects","responses":{"200":{"description":"Successful response with list of objects","content":{"application/json":{"schema":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string","description":"Unique identifier for the object","key$":"id"},"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types","additionalProperties":true,"key$":"data"}},"required":["id","name"],"x-ref":"#/components/schemas/Object","index$":0}},"example":[{"id":"1","name":"Google Pixel 6 Pro","data":{"color":"Cloudy White","capacity":"128 GB"}},{"id":"2","name":"Apple iPhone 12 Mini, 256GB, Blue","data":null}]}}}},"parameters":[],"securitySource":"unspecified"},"GET /objects/{id}":{"protocol":"http","operationId":"getObjectById","responses":{"200":{"description":"Successful response with object data","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"string","description":"Unique identifier for the object","key$":"id"},"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types","additionalProperties":true,"key$":"data"}},"required":["id","name"],"x-ref":"#/components/schemas/Object"},"example":{"id":"4","name":"Apple iPhone 11, 64GB","data":{"price":389.99,"color":"Purple"}}}}},"404":{"description":"Object not found"}},"parameters":[{"name":"id","in":"path","required":true,"description":"The ID of the object to retrieve","schema":{"type":"string"},"example":"4","index$":0}],"securitySource":"unspecified"},"PATCH /objects/{id}":{"protocol":"http","operationId":"partialUpdateObject","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)","additionalProperties":true,"key$":"data"}},"required":["name"],"x-ref":"#/components/schemas/ObjectInput","index$":1},"example":{"name":"Apple AirPods (Updated)","data":{"price":140}}}}},"responses":{"200":{"description":"Object partially updated successfully","content":{"application/json":{"schema":{"allOf":[{"type":"object","properties":{"id":{"type":"string","description":"Unique identifier for the object","key$":"id"},"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types","additionalProperties":true,"key$":"data"}},"required":["id","name"],"x-ref":"#/components/schemas/Object"},{"type":"object","properties":{"updatedAt":{"type":"string","format":"date-time","description":"Timestamp when the object was last updated"}}}],"x-ref":"#/components/schemas/ObjectWithUpdateTimestamp","index$":0}}}},"404":{"description":"Object not found"}},"parameters":[{"name":"id","in":"path","required":true,"description":"The ID of the object to partially update","schema":{"type":"string"},"index$":0}],"securitySource":"unspecified"},"DELETE /objects/{id}":{"protocol":"http","operationId":"deleteObject","responses":{"200":{"description":"Object deleted successfully","content":{"application/json":{"schema":{"type":"object","properties":{"message":{"type":"string","example":"Object deleted successfully"}}}}}},"404":{"description":"Object not found"}},"parameters":[{"name":"id","in":"path","required":true,"description":"The ID of the object to delete","schema":{"type":"string"},"index$":0}],"securitySource":"unspecified"},"PUT /objects/{id}":{"protocol":"http","operationId":"updateObject","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types (prices, dates, image URLs, text fields, etc.)","additionalProperties":true,"key$":"data"}},"required":["name"],"x-ref":"#/components/schemas/ObjectInput","index$":1},"example":{"name":"Apple AirPods","data":{"color":"white","generation":"3rd","price":135}}}}},"responses":{"200":{"description":"Object updated successfully","content":{"application/json":{"schema":{"allOf":[{"type":"object","properties":{"id":{"type":"string","description":"Unique identifier for the object","key$":"id"},"name":{"type":"string","description":"Name of the object","key$":"name"},"data":{"type":"object","nullable":true,"description":"Flexible JSON object containing custom attributes of various types","additionalProperties":true,"key$":"data"}},"required":["id","name"],"x-ref":"#/components/schemas/Object"},{"type":"object","properties":{"updatedAt":{"type":"string","format":"date-time","description":"Timestamp when the object was last updated"}}}],"x-ref":"#/components/schemas/ObjectWithUpdateTimestamp","index$":0},"example":{"id":"6","name":"Apple AirPods","data":{"color":"white","generation":"3rd","price":135},"updatedAt":"2022-11-21T20:06:23.986Z"}}}},"404":{"description":"Object not found"}},"parameters":[{"name":"id","in":"path","required":true,"description":"The ID of the object to update","schema":{"type":"string"},"example":"6","index$":0}],"securitySource":"unspecified"}})
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
  
