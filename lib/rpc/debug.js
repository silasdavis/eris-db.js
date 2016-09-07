'use strict'

var HTTPClient = require('./http')
var nUtil = require('util')

module.exports = DebugClient

/**
 * The <tt>HTTPClient</tt> class does RPCs over HTTP.
 *
 * @param {string} URL - The endpoint URL.
 * @augments module:rpc/client~Client
 * @constructor
 */
function DebugClient (URL) {
  HTTPClient.call(this, URL)
}

nUtil.inherits(DebugClient, HTTPClient)

/**
 * Send a message. This method is used for all RPC (RMI) methods.
 *
 * @param {string} message - The message.
 * @param {string} method - The method.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 *
 * @override
 */
DebugClient.prototype.sendMsg = function (message, method, callback) {
  console.log(`curl --data '${message}' --header ` +
    `"Content-Type:application/json" ${this._URL}\n`)

  HTTPClient.prototype.sendMsg.call(this, message, method,
    (error, response) => {
      if (error) {
        console.error(`${error}\n`)
      } else {
        console.log(`${response}\n`)
      }

      callback(error, response)
    })
}
