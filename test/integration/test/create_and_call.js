'use strict'

var assert = require('assert')
var createDb = require('../createDb')
var edbModule = require('../../../lib/')
var fs = require('fs')
var Solidity = require('solc')

var compiled
var input = ''
var address

describe('HttpCreateAndCall', function () {
  it('should call a contract', function (done) {
    this.timeout(30 * 1000)

    compiled = Solidity.compile(fs.readFileSync(__dirname + '/testtx.sol', 'utf8'))
      .contracts.testtx.bytecode

    createDb().spread(function (url, validator) {
      return edbModule.open('blockchain').then(function (edb) {
        var privateKey

        privateKey = validator.priv_key[1]

        edb.txs().transactAndHold(privateKey, '', compiled, 1000000, 0, null,
          function (error, data) {
            assert.ifError(error)
            address = data.call_data.callee
            edb.txs().call(address, input, function (error, data) {
              assert.ifError(error)

              assert.equal(data.return.slice((32 - 20) * 2).toUpperCase(),
                validator.address)

              done()
            })
          })
      })
    })
  })
})
