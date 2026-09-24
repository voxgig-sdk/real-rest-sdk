
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { RealRestSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = RealRestSDK.test()
    equal(testsdk instanceof RealRestSDK, true,
      'RealRestSDK.test() must return a client synchronously')
  })

})
