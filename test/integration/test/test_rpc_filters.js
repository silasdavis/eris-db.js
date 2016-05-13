/* This file is for testing RPC methods.
 */

'use strict'

var assert = require('assert')
var createDb = require('../createDb')
var edbModule = require('../../../lib/')
var Promise = require('bluebird')

var testData = require('./../../testdata/testdata_filters.json')
var edb

describe('ErisDbHttpFilters', function () {
  describe('#getAccounts', function () {
    this.timeout(30 * 1000)

    before(function () {
      return createDb().spread(function (url, validator) {
        return edbModule.open('blockchain').then(function (connection) {
          var txs

          edb = connection
          txs = edb.txs()
          Promise.promisifyAll(txs)

          return Promise.all(testData.chain_data.genesis.accounts.map(
            function (account) {
              return txs.sendAndHoldAsync(validator.priv_key[1],
                account.address, account.amount, null)
            }))
        })
      })
    })

    it('should get the filtered list of accounts', function (done) {
      var filters = testData.GetAccounts0.input
      var exp = testData.GetAccounts0.output
      edb.accounts().getAccounts(filters, check(exp, done))
    })

    it('should get the filtered list of accounts', function (done) {
      var filters = testData.GetAccounts1.input
      var exp = testData.GetAccounts1.output

      edb.accounts().getAccounts(filters, function (error, data) {
        check(exp, done)(error, {accounts: data.accounts.slice(0, -1)})
      })
    })

    it('should get the filtered list of accounts', function (done) {
      var filters = testData.GetAccounts2.input
      var exp = testData.GetAccounts2.output
      edb.accounts().getAccounts(filters, check(exp, done))
    })
  })
})

// Expected is the expected data. done is the mocha done-function, modifiers are
// used to overwrite fields in the return-data that should not be included in the
// tests (like certain timestamps for example).
function check (expected, done, fieldModifiers) {
  return function (error, data) {
    if (error) {
      console.log(error)
    }
    if (fieldModifiers && fieldModifiers.length > 0) {
      for (var i = 0; i < fieldModifiers.length; i++) {
        fieldModifiers[i](data)
      }
    }
    try {
      assert.ifError(error, 'Failed to call rpc method.')
      assert.deepEqual(data, expected)
      done()
    } catch (exception) {
      done(exception)
    }
  }
}
