'use strict'

var assert = require('assert')
var createDb = require('../createDb')
var edbModule = require('../../../lib/')

var compiled = '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b609480603e6000396000f30060606040523615600d57600d565b60685b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050805033600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b90565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f3'
var address

describe('HttpCreateAndTx', function () {
  it('should create a contract then transact to it', function (done) {
    this.timeout(30 * 1000)

    createDb().spread(function (url, validator) {
      return edbModule.open('blockchain').then(function (edb) {
        var user

        user = validator.address

        edb.txs().transactAndHold(user, '', compiled, 100000, 0, null, function (error, data) {
          assert.ifError(error)
          address = data.call_data.callee
          edb.txs().transactAndHold(user, address, '', 100000, 0, null, function (error, data) {
            assert.ifError(error)
            assert.equal(data.return, '000000000000000000000000' + validator.address)
            done()
          })
        })
      })
    })
  })
})
