
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { RealRestSDK } from '..'


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await RealRestSDK.test()
    equal(null !== testsdk, true)
  })

})
