'use strict'

const assert = require('assert')
const F = require('fairmont')
const I = require('iteray')
const jsonRpcClient = require('../../lib/JSON-RPC')

describe('a client of the JSON-RPC 2.0 protocol', function () {
  it('complies with the named parameters example', function () {
    const client = jsonRpcClient({
      methodNames: ['subtract'],
      responses: I.pullSerially([
        {'jsonrpc': '2.0', 'result': 19, 'id': 0},
        {'jsonrpc': '2.0', 'result': 19, 'id': 1}
      ])
    })

    const server = client.methods

    return Promise.all([
      server.subtract({subtrahend: 23, minuend: 42}),
      server.subtract({minuend: 42, subtrahend: 23})
    ]).then((values) => {
      assert.deepEqual(values, [19, 19])

      return F.collect(I.slice(0, 2, client.requests))
        .then((requests) => {
          assert.deepEqual(requests, [
            {
              'jsonrpc': '2.0',
              'method': 'subtract',
              'params': {'subtrahend': 23, 'minuend': 42},
              'id': 0
            },
            {
              'jsonrpc': '2.0',
              'method': 'subtract',
              'params': {'minuend': 42, 'subtrahend': 23},
              'id': 1
            }
          ])
        })
    })
  })
})
