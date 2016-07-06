/*eslint-disable no-multi-str */

'use strict'

var child_process = require('child_process')
var erisDb = require('../../')
var untildify = require('untildify')
var url = require('url')
var _ = require('lodash')

// Create a fresh chain for each integration test.  Return its URL and
// validator.
module.exports = function (protocol) {
  child_process.execSync('eris chains rm --data --force blockchain; \
    eris chains new --dir=blockchain --publish blockchain; \
    sleep 3', {
      encoding: 'utf8',
      env: _.assign({}, process.env, {ERIS_PULL_APPROVE: true})
    })

  return erisDb.serviceUrl('chains', 'blockchain', 1337)
    .then(function (locator) {
      if (protocol === 'WebSocket') {
        locator.protocol = 'ws:'
      }

      return [url.format(locator) +
        (protocol === 'WebSocket' ? '/socketrpc' : '/rpc'),
        require(untildify('~/.eris/chains/blockchain/priv_validator.json'))]
    })
}
