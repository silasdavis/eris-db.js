/* This file is for testing RPC methods using a mock client.
 */
var assert = require('assert')
var testData = require('../testdata/testdata_mock.json')
var template = require('../mock/test_template')
var MockClient = require('../mock/mock_client')
var erisdbFactory = require('../../lib')

var handlers = template.getHandlers(testData)
var testAddress = '75'

// Mock it up!
erisdbFactory.serviceUrl = function () {
  return Promise.resolve({
    protocol: 'http:',
    slashes: true,
    hostname: 'localhost',
    port: 12345
  })
}

// TODO update to use the appropriate event type for each sub once the test data update is done.
describe('Event tests with mock rpc client', function () {
  var edb

  before(function () {
    return erisdbFactory.open('blockchain', {client: new MockClient(handlers)})
      .then(function (db) {
        edb = db

        // We don't want to wait a full second for poll to be called.
        edb.events().setPollingInterval(1)
      })
  })

  describe('.subSolidityEvent', function () {
    it('should subscribe to solidity event using once', function (done) {
      edb.events().subSolidityEvent(testAddress, function (error, event) {
        assert.ifError(error)
        console.log(event)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to solidity event', function (done) {
      var sub
      edb.events().subSolidityEvent(testAddress, function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subAccountInput', function () {
    it('should subscribe to account input using once', function (done) {
      edb.events().subAccountInput(testAddress, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to account input', function (done) {
      var sub
      edb.events().subAccountInput(testAddress, function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subAccountOutput', function () {
    it('should subscribe to account output using once', function (done) {
      edb.events().subAccountOutput(testAddress, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to account output', function (done) {
      var sub
      edb.events().subAccountOutput(testAddress, function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subAccountReceive', function () {
    it('should subscribe to account receive using once', function (done) {
      edb.events().subAccountReceive(testAddress, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to account receive', function (done) {
      var sub
      edb.events().subAccountReceive(testAddress, function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subBonds', function () {
    it('should subscribe to bond events using once', function (done) {
      edb.events().subBonds(function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to bond events', function (done) {
      var sub
      edb.events().subBonds(function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subUnbonds', function () {
    it('should subscribe to unbond events using once', function (done) {
      edb.events().subUnbonds(function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to unbond events', function (done) {
      var sub
      edb.events().subUnbonds(function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subRebonds', function () {
    it('should subscribe to rebond events using once', function (done) {
      edb.events().subRebonds(function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to rebond events', function (done) {
      var sub
      edb.events().subRebonds(function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subDupeouts', function () {
    it('should subscribe to dupeout events using once', function (done) {
      edb.events().subDupeouts(function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to dupeout events', function (done) {
      var sub
      edb.events().subDupeouts(function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subNewBlocks', function () {
    it('should subscribe to new block events using once', function (done) {
      edb.events().subNewBlocks(function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to new block events', function (done) {
      var sub
      edb.events().subNewBlocks(function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })

  describe('.subForks', function () {
    it('should subscribe to fork events using once', function (done) {
      edb.events().subForks(function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        done()
      })
    })

    it('should subscribe to fork events', function (done) {
      var sub
      edb.events().subForks(function (error, eventSub) {
        assert.ifError(error)
        sub = eventSub
      }, function (error, event) {
        assert.ifError(error)
        assert.deepEqual(testData.EventPoll.output.events[0][1], event, 'Event did not match.')
        sub.stop()
        done()
      })
    })
  })
})
