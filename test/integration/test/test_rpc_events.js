/* This file is for testing an event.
 */

'use strict'

var assert = require('assert')
var createDb = require('../createDb')
var edbModule = require('../../../lib/')

var eventSub

describe('TheloniousHttpEvents', function () {
  describe('.events', function () {
    describe('#subNewBlock', function () {
      it('should subscribe to new block events', function (done) {
        this.timeout(20 * 1000)

        createDb().spread(function (url) {
          edbModule.open('blockchain').then(function (edb) {
            edb.events().subNewBlocks(function (err, data) {
              assert.ifError(err, 'New block subscription error.')
              eventSub = data
            }, function (err, data) {
              assert.ifError(err)

              if (data) {
                eventSub.stop(function () {
                  done()
                })
              }
            })
          })
        })
      })
    })
  })
})
