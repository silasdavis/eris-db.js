/*eslint-disable no-multi-str */

'use strict'

var assert = require('assert')
var createDb = require('../createDb')
var erisDb = require('../../../')
var Solidity = require('solc')

describe('permissions', function () {
  var db
  var validator

  before(function () {
    this.timeout(30 * 1000)

    return createDb().spread(function (url, privateValidator) {
      validator = privateValidator

      return erisDb.open('blockchain')
        .then(function (connection) {
          db = connection
        })
    })
  })

  after(function (done) {
    db.close(done)
  })

  it('should set a base permission', function (done) {
    var source
    var compiled

    this.timeout(10 * 1000)

    source = '\
    contract testtx { \
        address caller; \
\
        function testtx(){ \
            caller = msg.sender; \
        } \
\
        function() returns (address previousCaller) { \
            previousCaller = caller; \
            caller = msg.sender; \
        } \
\
    } \
'

    compiled = Solidity.compile(source).contracts.testtx.bytecode

    db.txs().transactAndHold(validator.priv_key[1], '', compiled, 1000000, 0,
      null, function (error, data) {
        var address

        assert.ifError(error)
        address = data.call_data.callee

        db.accounts().getAccount(validator.address, function (error, account) {
          assert.ifError(error)

          account.setPermission('call', false, {user: validator.address}).then(function () {
            db.txs().transactAndHold(validator.priv_key[1], address, '',
              100000, 0, null, function (error) {
                assert(error)

                account.setPermission('call', true, {user: validator.address}).then(function () {
                  db.txs().transactAndHold(validator.priv_key[1], address, '',
                    100000, 0, null, function (error, data) {
                      assert.ifError(error)
                      done()
                    })
                })
              })
          })
        })
      })
  })
})
