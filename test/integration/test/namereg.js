'use strict'

var assert = require('assert')
var createDb = require('../createDb')
var edbModule = require('../../../lib/')
var test_data = require('./../../testdata/testdata.json')

var edb
var privKey

describe('TestNameReg', function () {
  before(function (done) {
    this.timeout(30 * 1000)

    createDb().spread(function (url, validator) {
      return edbModule.open('blockchain').then(function (connection) {
        edb = connection
        privKey = validator.priv_key[1]
        done()
      })
    })
  })

  it('should register an entry in the namereg', function (done) {
    this.timeout(6000)

    var input = test_data.SetEntry.input
    var name = input.name
    var data = input.data
    var numBlocks = input.numBlocks

    edb.namereg().setEntry(privKey, name, data, numBlocks, function (error, data) {
      assert.ifError(error)

      edb.namereg().getEntry(name, function (error, entry) {
        assert.ifError(error)
        assert.deepEqual(entry, data, 'output does not match expected')
        done()
      })
    })
  })
})
