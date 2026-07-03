
const envlocal = __dirname + '/../../../.env.local'
require('dotenv').config({ quiet: true, path: [envlocal] })

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'


import { RealRestSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveDelay,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


describe('ObjectEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when REALREST_TEST_LIVE=TRUE.
  afterEach(liveDelay('REALREST_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = RealRestSDK.test()
    const ent = testsdk.Object()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.REAL_REST_TEST_LIVE
    for (const op of ['create', 'list', 'update', 'load', 'remove']) {
      if (maybeSkipControl(t, 'entityOp', 'object.' + op, live)) return
    }

    const setup = basicSetup()
    // The basic flow consumes synthetic IDs and field values from the
    // fixture (entity TestData.json). Those don't exist on the live API.
    // Skip live runs unless the user provided a real ENTID env override.
    if (setup.syntheticOnly) {
      t.skip('live entity test uses synthetic IDs from fixture — set REAL_REST_TEST_OBJECT_ENTID JSON to run live')
      return
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const object_ref01_ent = client.Object()
    let object_ref01_data = setup.data.new.object['object_ref01']

    object_ref01_data = await object_ref01_ent.create(object_ref01_data)
    assert(null != object_ref01_data.id)


    // LIST
    const object_ref01_match: any = {}

    const object_ref01_list = await object_ref01_ent.list(object_ref01_match)

    assert(!isempty(select(object_ref01_list, { id: object_ref01_data.id })))


    // UPDATE
    const object_ref01_data_up0: any = {}
    object_ref01_data_up0.id = object_ref01_data.id

    const object_ref01_markdef_up0 = { name: 'name', value: 'Mark01-object_ref01_' + setup.now }
    object_ref01_data_up0 [object_ref01_markdef_up0.name] = object_ref01_markdef_up0.value

    const object_ref01_resdata_up0 = await object_ref01_ent.update(object_ref01_data_up0)
    assert(object_ref01_resdata_up0.id === object_ref01_data_up0.id)

    assert(object_ref01_resdata_up0[object_ref01_markdef_up0.name] === object_ref01_markdef_up0.value)


    // LOAD
    const object_ref01_match_dt0: any = {}
    object_ref01_match_dt0.id = object_ref01_data.id
    const object_ref01_data_dt0 = await object_ref01_ent.load(object_ref01_match_dt0)
    assert(object_ref01_data_dt0.id === object_ref01_data.id)


    // REMOVE
    const object_ref01_match_rm0: any = { id: object_ref01_data.id }
    await object_ref01_ent.remove(object_ref01_match_rm0)
  

    // LIST
    const object_ref01_match_rt0: any = {}

    const object_ref01_list_rt0 = await object_ref01_ent.list(object_ref01_match_rt0)

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

  // Detect whether the user provided a real ENTID JSON via env var. The
  // basic flow consumes synthetic IDs from the fixture file; without an
  // override those synthetic IDs reach the live API and 4xx. Surface this
  // to the test so it can skip rather than fail.
  const idmapEnvVal = process.env['REAL_REST_TEST_OBJECT_ENTID']
  const idmapOverridden = null != idmapEnvVal && idmapEnvVal.trim().startsWith('{')

  const env = envOverride({
    'REAL_REST_TEST_OBJECT_ENTID': idmap,
    'REAL_REST_TEST_LIVE': 'FALSE',
    'REAL_REST_TEST_EXPLAIN': 'FALSE',
    'REAL_REST_APIKEY': 'NONE',
  })

  idmap = env['REAL_REST_TEST_OBJECT_ENTID']

  const live = 'TRUE' === env.REAL_REST_TEST_LIVE

  if (live) {
    client = new RealRestSDK(merge([
      {
        apikey: env.REAL_REST_APIKEY,
      },
      extra
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
    syntheticOnly: live && !idmapOverridden,
    now: Date.now(),
  }

  return setup
}
  
