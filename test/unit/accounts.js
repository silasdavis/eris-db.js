'use strict'

var rewire = require('rewire')
var assert = require('assert')
var Accounts = rewire('../../lib/accounts')
var MockClient = require('../mock/mock_client')
var template = require('../mock/test_template')
var td = require('testdouble')
var testData = require('../testdata/testdata_mock.json')

var handlers = template.getHandlers(testData)

function mockJaysonRequest (request) {
  Accounts.__set__('jayson', {
    client: {
      http: function () {
        return {request: request}
      }
    }
  })
}

describe('accounts', function () {
  var mockErisDb
  var accounts
  var account

  before(function (done) {
    mockErisDb = {
      accounts: function () { return accounts },

      keyServer: {
        publicKeyFor: function () { return Promise.resolve() },
        sign: function () { return Promise.resolve(Buffer('')) }
      },

      user: testData.GetAccount.input.address
    }

    accounts = Accounts.createInstance(new MockClient(handlers), null,
      mockErisDb)

    accounts.getAccount(testData.GetAccount.input.address,
      function (error, testAccount) {
        assert.ifError(error)

        account = testAccount
        done()
      })
  })

  beforeEach(function () {
    mockErisDb.user = '37236DF251AB70022B1DA351F08A20FB52443E37'
  })

  afterEach(function () {
    td.reset()
  })

  describe('getAccount', function () {
    describe('setPermission', function () {
      it('warns about attempting to set unsupported permissions',
        function () {
          return account.setPermission('send', false).catch(function (reason) {
            assert.equal(reason.message, 'Unsupported permission type: send')
          })
        })

      it('warns if the user is not specified', function () {
        delete mockErisDb.user

        return account.setPermission('call', false).catch(function (reason) {
          assert.equal(reason.message,
            "Can't set permissions unless logged in.")
        })
      })

      it('the first transaction in the sequence includes the public key',
        function (done) {
          mockJaysonRequest(function (method, params) {
            assert('pub_key' in params[0][1].input)
            done()
          })

          return account.setPermission('call', false)
        })

      it('later transactions in the sequence omit the public key',
        function (done) {
          mockJaysonRequest(function (method, params) {
            assert(!('pub_key' in params[0][1].input))
            done()
          })

          td.replace(accounts, 'getAccount', function (address, callback) {
            callback(null, {sequence: 10})
          })

          return account.setPermission('call', false)
        })

      it('sets the call permission to false', function (done) {
        mockJaysonRequest(function (method, params) {
          assert(!params[0][1].args[1].value)
          done()
        })

        return account.setPermission('call', false)
      })

      it('sets the call permission to true', function (done) {
        mockJaysonRequest(function (method, params) {
          assert(params[0][1].args[1].value)
          done()
        })

        return account.setPermission('call', true)
      })

      it('creates a signature', function (done) {
        mockJaysonRequest(function (method, params) {
          assert('signature' in params[0][1].input)
          done()
        })

        return account.setPermission('call', false)
      })
    })
  })
})
