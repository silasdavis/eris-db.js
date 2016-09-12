/**
 * @file http.js
 * @fileOverview Factory module for the http client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/http
 */
'use strict'

var Client = require('./client')
const httpClient = require('request-promise')
const I = require('iteray')
const jsonRpc = require('@nodeguy/json-rpc')
const R = require('ramda')
var rpc = require('./rpc')
var nUtil = require('util')
var HTTPRequest

if (typeof (XMLHttpRequest) === 'undefined') {
  HTTPRequest = require('xmlhttprequest').XMLHttpRequest
} else {
  HTTPRequest = XMLHttpRequest
}

module.exports = HTTPClient

/**
 * The <tt>HTTPClient</tt> class does RPCs over HTTP.
 *
 * @param {string} URL - The endpoint URL.
 * @augments module:rpc/client~Client
 * @constructor
 */
function HTTPClient (URL) {
  Client.call(this, URL)

  /**
   * The current request id. It is incremented by 1 for each request that's made.
   *
   * @type {number}
   *
   * @private
   */
  this._currentId = 1

  // Work around Eris DB bug: https://github.com/eris-ltd/eris-db/issues/271
  const convertIdToString = (request) =>
    R.assoc('id', String(request.id), request)

  const addErisDbNamespace = (request) =>
    R.assoc('method', 'erisdb.' + request.method, request)

  const jsonRpcToHttpRequest = (request) => ({
    url: this._URL,
    method: 'POST',
    json: true,
    body: request
  })

  const httpToJsonRpcError = (promise) =>
    promise.catch((reason) => ({
      jsonrpc: '2.0',
      error: reason.error,
      id: reason.options.body.id
    }))

  // Work around Eris DB bug: https://github.com/eris-ltd/eris-db/issues/270
  const removeNullError = (response) =>
    response.error === null
      ? R.dissoc('error', response)
      : response

  const transport = R.pipe(
    I.map(R.pipe(
      convertIdToString,
      addErisDbNamespace,
      jsonRpcToHttpRequest,
      httpClient,
      httpToJsonRpcError
    )),
    I.pullSerially,
    I.map(removeNullError)
  )

  this.methods = jsonRpc.client({
    methodNames: ['getChainId'],
    transport
  })
}

nUtil.inherits(HTTPClient, Client)

/**
 * Send a message. This method is used for all RPC (RMI) methods.
 *
 * @param {string} method - The rpc method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 *
 * @override
 */
HTTPClient.prototype.send = function (method, params, callback) {
  var id = this._nextId()
  var req = rpc.request(id, method, params)
  var msg = JSON.stringify(req)

  this.sendMsg(msg, 'POST', function (error, data) {
    var resp

    if (error) {
      callback(error)
      return
    }

    try {
      resp = JSON.parse(data)
    } catch (err) {
      callback(new Error('Error when parsing json response: ' + err + ': (' + data + ')'))
      return
    }
    if (!rpc.isResponse(resp)) {
      callback(new Error('Response object is not a proper json-rpc 2.0 response object.'))
      return
    }

    if (resp.error) {
      rpc.printError(resp)
      callback(new Error(resp.error.message))
    } else {
      callback(null, resp.result)
    }
  })
}

/**
 * Send a message. This method is used for all RPC (RMI) methods.
 *
 * @param {string} message - The message.
 * @param {string} method - The method.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 *
 * @override
 */
HTTPClient.prototype.sendMsg = function (message, method, callback) {
  var httpRequest = new HTTPRequest()
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState == 4) {
      if (httpRequest.status < 200 || httpRequest.status > 299) {
        callback(new Error(httpRequest.responseText))
      } else {
        callback(null, httpRequest.responseText)
      }
    }
  }
  httpRequest.open(method, this._URL, true)
  if (method == 'POST') {
    httpRequest.setRequestHeader('Content-Type', 'application/json')
  }
  httpRequest.send(message)
}
