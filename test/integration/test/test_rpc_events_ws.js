/* This file is for testing an event.
 */

'use strict'

var assert = require('assert')
var createDb = require('../createDb')
var edbModule = require('../../../lib/')

var edb
var eventSub

describe('TheloniousWebSocketEvents', function () {
  before(function () {
    this.timeout(30 * 1000)

    return createDb('WebSocket').spread(function (url) {
      return edbModule.open('blockchain').then(function (connection) {
        edb = connection
      })
    })
  })

  describe('.events', function () {
    describe('#subNewBlock', function () {
      it('should subscribe to new block events', function (done) {
        this.timeout(6000)
        edb.events().subNewBlocks(function (err, data) {
          assert.ifError(err, 'New block subscription error.')
          eventSub = data
        }, function (err, data) {
          assert.ifError(err)

          if (data) {
            eventSub.stop(function () {})
            done()
          }
        })
      })
    })
  })
})
