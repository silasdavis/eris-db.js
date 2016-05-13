/*eslint-disable no-multi-str */

'use strict'

var rewire = require('rewire')
var assert = require('assert')
var erisDb = rewire('../../lib/')
var Promise = require('bluebird')

function mockExec (portMap) {
  function execAsync (command) {
    return Promise.resolve(command === 'docker-machine ip'
      ? '192.168.99.100'
      : portMap)
  }

  erisDb.__set__('child_process', {execAsync: execAsync})
  erisDb.__set__('dockerMachineIp', execAsync)
}

describe('eris inspection', function () {
  it('gets the port mappings for a chain', function () {
    mockExec('map[1337/tcp:[{0.0.0.0 33121}] 46656/tcp:[{0.0.0.0 33120}] \
46657/tcp:[{0.0.0.0 33119}]]\n')

    return erisDb.serviceUrl('chain', 'blockchain', 1337).then(function (url) {
      assert.deepEqual(url, {
        protocol: 'http:',
        slashes: true,
        hostname: '192.168.99.100',
        port: 33121
      })
    })
  })

  it('gets the port mapping for Eris Keys', function () {
    mockExec('map[4767/tcp:[{0.0.0.0 33128}]]\n')

    return erisDb.serviceUrl('services', 'keys', 4767).then(function (map) {
      assert.deepEqual(map, {
        protocol: 'http:',
        slashes: true,
        hostname: '192.168.99.100',
        port: 33128
      })
    })
  })
})
