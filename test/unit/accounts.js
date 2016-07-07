'use strict'

var rewire = require('rewire')
var assert = require('assert')
var Accounts = rewire('../../lib/accounts')
var MockClient = require('../mock/mock_client')
var template = require('../mock/test_template')
var testData = require('../testdata/testdata_mock.json')

var handlers = template.getHandlers(testData)

describe('accounts', () => {
  function mockAccount (options) {
    var mockErisDb
    var accounts

    options = options || {}

    mockErisDb = {
      accounts: function () { return accounts },

      keyServer: {
        publicKeyFor: function () { return Promise.resolve() },
        sign: function () { return Promise.resolve(Buffer('')) }
      },

      user: options.noUser ? undefined : testData.GetAccount.input.address,

      txs: () => ({
        broadcastTx: (transaction, callback) => {
          assert(options.broadcastTxTest(transaction))
          callback()
        }
      })
    }

    accounts = Accounts.createInstance(new MockClient(handlers), null,
      mockErisDb)

    return new Promise((resolve, reject) => {
      accounts.getAccount(testData.GetAccount.input.address,
        function (error, testAccount) {
          if (error) {
            reject(error)
          }

          if (options.getAccount) {
            accounts.getAccount = options.getAccount
          }

          resolve(testAccount)
        })
    })
  }

  describe('getAccount', function () {
    describe('setPermission', function () {
      it('warns about attempting to set unsupported permissions', () =>
        mockAccount().then(account =>
          account.setPermission('send', false).catch(reason => {
            assert.equal(reason.message, 'Unsupported permission type: send')
          })
        )
      )

      it('warns if the user is not specified', (done) => {
        mockAccount({noUser: true})
          .then(account => account.setPermission('call', false))
          .catch(reason => {
            assert.equal(
              reason.message,
              "Can't set permissions unless logged in."
            )

            done()
          })
      })

      it('the first transaction in the sequence includes the public key', () =>
        mockAccount({
          broadcastTxTest: transaction => 'pub_key' in transaction[1].input
        }).then(account => account.setPermission('call', false))
      )

      it('later transactions in the sequence omit the public key', () =>
        mockAccount({
          broadcastTxTest: transaction => !('pub_key' in transaction[1].input),
          getAccount: (address, callback) => { callback(null, {sequence: 10}) }
        }).then(account => account.setPermission('call', false))
      )

      it('sets the call permission to false', () =>
        mockAccount({
          broadcastTxTest: transaction => !transaction[1].args[1].value
        }).then(account => account.setPermission('call', false))
      )

      it('sets the call permission to true', () =>
        mockAccount({
          broadcastTxTest: transaction => transaction[1].args[1].value
        }).then(account => account.setPermission('call', true))
      )

      it('creates a signature', () =>
        mockAccount({
          broadcastTxTest: transaction => 'signature' in transaction[1].input
        }).then(account => account.setPermission('call', false))
      )
    })
  })
})
