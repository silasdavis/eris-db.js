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
var nUtil = require('util')

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

  // Work around Eris DB bug: https://github.com/eris-ltd/eris-db/issues/271
  const convertIdToString = (request) =>
    R.assoc('id', String(request.id), request)

  const addErisDbNamespace = (request) =>
    R.assoc('method', 'erisdb.' + request.method, request)

  // Eris DB wants named parameters, sigh.
  const positionToNamedParameters = (request) =>
    R.assoc('params', request.params[0], request)

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
      positionToNamedParameters,
      jsonRpcToHttpRequest,
      httpClient,
      httpToJsonRpcError
    )),
    I.pullSerially,
    I.map(removeNullError)
  )

  // Our API expects callbacks instead of promises so wrap each method.
  const wrapMethod = (method) =>
    function () {
      const callback = I.get(-1, arguments)

      method.apply(null, I.slice(0, -1, arguments)).then(
        (value) => callback(null, value),
        (reason) => callback(reason)
      )
    }

  const methodNames = [
    'broadcastTx',
    'call',
    'callCode',
    'eventPoll',
    'eventSubscribe',
    'eventUnsubscribe',
    'getAccount',
    'getAccounts',
    'getBlockchainInfo',
    'getChainId',
    'getClientVersion',
    'getConsensusState',
    'getGenesisHash',
    'getLatestBlock',
    'getLatestBlockHeight',
    'getListeners',
    'getMoniker',
    'getNameRegEntries',
    'getNameRegEntry',
    'getNetworkInfo',
    'getPeer',
    'getPeers',
    'genPrivAccount',
    'getStorage',
    'getStorageAt',
    'getUnconfirmedTxs',
    'getValidators',
    'isListening',
    'send',
    'sendAndHold',
    'transact',
    'transactAndHold',
    'transactNameReg'
  ]

  const client = jsonRpc.client({
    methodNames,
    transport
  })

  this.methods = I.map(
    (property) => [property[0], wrapMethod(property[1])],
    client.methods
  )

  I.toNodeStream(client.errors).pipe(process.stderr)
}

nUtil.inherits(HTTPClient, Client)
