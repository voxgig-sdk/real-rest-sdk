import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "object",
    "accessor": "Object",
    "op": "create",
    "method": "POST",
    "path": "/objects",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "id": "13",
      "name": "Apple iPad Air",
      "data": {
        "Generation": "4th",
        "Price": "519.99",
        "Capacity": "256 GB"
      },
      "createdAt": "2022-11-21T20:06:23.986Z"
    },
    "idField": "id"
  },
  {
    "entity": "object",
    "accessor": "Object",
    "op": "list",
    "method": "GET",
    "path": "/objects?id={ids}",
    "args": [
      {
        "name": "ids",
        "wire": "ids",
        "value": "p1"
      }
    ],
    "select": {
      "id": "1,2,3"
    },
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [
      "id"
    ],
    "queryArgs": [
      {
        "name": "id",
        "wire": "id"
      }
    ],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "id": "x",
        "name": "x",
        "data": {}
      }
    ],
    "idField": "id"
  },
  {
    "entity": "object",
    "accessor": "Object",
    "op": "list",
    "method": "GET",
    "path": "/objects",
    "args": [],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": [
      {
        "id": "1",
        "name": "Google Pixel 6 Pro",
        "data": {
          "color": "Cloudy White",
          "capacity": "128 GB"
        }
      },
      {
        "id": "2",
        "name": "Apple iPhone 12 Mini, 256GB, Blue",
        "data": null
      }
    ],
    "idField": "id"
  },
  {
    "entity": "object",
    "accessor": "Object",
    "op": "load",
    "method": "GET",
    "path": "/objects/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "4"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "id": "4",
      "name": "Apple iPhone 11, 64GB",
      "data": {
        "price": 389.99,
        "color": "Purple"
      }
    },
    "idField": "id"
  },
  {
    "entity": "object",
    "accessor": "Object",
    "op": "patch",
    "method": "PATCH",
    "path": "/objects/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "id": "x",
      "name": "x",
      "data": {},
      "updatedAt": "2026-01-01T00:00:00Z"
    },
    "idField": "id"
  },
  {
    "entity": "object",
    "accessor": "Object",
    "op": "remove",
    "method": "DELETE",
    "path": "/objects/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "message": "Object deleted successfully"
    },
    "idField": "id"
  },
  {
    "entity": "object",
    "accessor": "Object",
    "op": "update",
    "method": "PUT",
    "path": "/objects/{id}",
    "args": [
      {
        "name": "id",
        "wire": "id",
        "value": "6"
      }
    ],
    "select": {},
    "headers": [],
    "cookies": [],
    "responseMedia": [
      "application/json"
    ],
    "query": [],
    "queryArgs": [],
    "auth": null,
    "status": 200,
    "sample": {
      "id": "6",
      "name": "Apple AirPods",
      "data": {
        "color": "white",
        "generation": "3rd",
        "price": 135
      },
      "updatedAt": "2022-11-21T20:06:23.986Z"
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
