'use strict'

var createDb = require('../createDb')
var erisDb = require('../../../lib')

describe('getting blockchain-related data', function () {
  var db

  before(function () {
    this.timeout(10 * 1000)

    return createDb().spread(function (url) {
      return erisDb.open('blockchain').then(function (connection) {
        db = connection
      })
    })
  })

  after(function () {
    db.close()
  })

  it('gets a series of blocks from the chain', function (done) {
    this.timeout(10 * 1000)
    db.blockchain().getBlocks(done)
  })
})
