/* This file is for testing RPC methods.
 */

var assert = require('assert')
var edbModule = require('../../lib/')

var testData = require('../testdata/testdata_mock.json')
var template = require('../mock/test_template')

var handlers = template.getHandlers(testData)
var port = 12345
var MockWebsocketServer = require('../mock/mock_ws_server')
var server = new MockWebsocketServer(port, handlers)

// Mock it up!
edbModule.serviceUrl = function () {
  return Promise.resolve({
    protocol: 'http:',
    slashes: true,
    hostname: 'localhost',
    port: 12345
  })
}

edbModule.open('blockchain').then(function (edb) {
  describe('tests with mock rpc server over websocket', function () {
    var tests

    tests = template.getTests(edb, testData)

    tests.forEach(function (test) {
      it('should call ' + test[0] + ' successfully.', function (done) {
        var f = test[1]
        var expected = testData[test[0]].output
        if (test.length > 2) {
          var args = test.slice(2)
          args.push(check(expected, done))
          f.apply(this, args)
        } else {
          f(check(expected, done))
        }
      })
    })
  })

  run()
})

// Expected is the expected data. done is the mocha done-function.
function check (expected, done) {
  return function (error, data) {
    if (error) {
      console.log(error)
    }
    assert.ifError(error, 'Failed to call rpc method.')
    assert.deepEqual(data, expected)
    done()
  }
}
