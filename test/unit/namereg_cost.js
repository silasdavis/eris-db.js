var assert = require('assert')
var nameregModule = require('../../lib/namereg')
var namereg = nameregModule.createInstance()

describe('Namereg.calculateCost', function () {
  it('should calculate the correct cost', function () {
    var expected = 360
    var cost = namereg.calculateCost(10, 'haha')
    assert.equal(cost, expected, 'cost calculation failed.')
  })
})
