'use strict'

var childProcess = require('child_process')
var fs = require('fs')
var Promise = require('bluebird')
var R = require('ramda')
var untildify = require('untildify')

Promise.promisifyAll(childProcess)
Promise.promisifyAll(fs)

// Create a fresh chain for each integration test.  Return its URL and
// validator.
module.exports = function () {
  var blockchainName
  var name = 'blockchain'
  var privateValidator

  blockchainName = childProcess.execAsync(`
    eris chains rm --data --force ${name}
    eris chains new --dir=blockchain --api --publish ${name}
  `, {
    encoding: 'utf8',
    env: R.assoc('ERIS_PULL_APPROVE', true, process.env)
  }).delay(3 * 1000).return(name)

  privateValidator = fs.readFileAsync(
    untildify(`~/.eris/chains/${name}/priv_validator.json`)).then(JSON.parse)

  return Promise.all([blockchainName, privateValidator])
}
