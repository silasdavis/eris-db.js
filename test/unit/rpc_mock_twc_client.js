/* This file is for testing RPC methods using a mock client.
 */
var assert = require('assert')

var testData = require('../testdata/testdata_mock.json')
var template = require('../mock/test_template')
var MockTwcClient = require('../mock/mock_twc_client')
var erisdbFactory = require('../../lib/')

var handlers = template.getHandlers(testData)

erisdbFactory.open('blockchain', {client: new MockTwcClient(handlers)})
  .then(function (edb) {
    var tests

    tests = template.getTests(edb, testData)

    describe('tests with mock rpc two-way client', function () {
      tests.forEach(function (test) {
        it('should call ' + test[0] + ' succesfully.', function (done) {
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

// Expected is the expected data. done is the mocha done-function, modifiers are
// used to overwrite fields in the return-data that should not be included in the
// tests (like certain timestamps for example).
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
