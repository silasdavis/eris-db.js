/**
 * @file websocket.js
 * @fileOverview Factory module for the websocket client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/websocket
 */
'use strict';

const I = require('iteray')
const jsonRpc = require('@nodeguy/json-rpc')
const R = require('ramda')
var TWCClient = require('./twc_client');
var nUtil = require('util');
const WebSocket = require('ws')
const stream = require('stream')

module.exports = WebSocketClient;

const webSocketPipe = (socket) =>
  (input) =>
    I.toAsyncIterable((callback) => {
      const inputIterator = I.toIterator(input)

      const next = () => {
        if (socket.readyState === socket.OPEN) {
          inputIterator.next().then((result) => {
            if (result.done) {
              socket.close()
            } else {
              socket.send(result.value)
            }

            setImmediate(next)
          })
        }
      }

      socket.onclose = (event) => {
        callback(null, {done: true})
      }

      socket.onerror = callback

      socket.onmessage = (event) => {
        callback(null, {done: false, value: event.data})
      }

      socket.onopen = next
      next()
    })

/**
 * The <tt>WebSocketClient</tt> class does RPCs over websocket.
 *
 * @param {string} URL - The endpoint URL.
 * @augments module:rpc/client~Client
 * @constructor
 */
function WebSocketClient(URL) {
    TWCClient.call(this, URL);

    /**
     * The websocket client object.
     *
     * @private
     */
    this._userCallback = null;
    this._reconnectCallback = null;
    this._shutdownCallback = null;
}

nUtil.inherits(WebSocketClient, TWCClient);

/**
 * Start the websocket service.
 *
 * @param {module:rpc/client~netStartCallback} callback - Called when connected to the RPC server.
 *
 * @override
 */
WebSocketClient.prototype.start = function (callback) {
    this._start(callback);
};

WebSocketClient.prototype._start = function (callback) {
    const webSocketClient = this
    let callbackCalled = false
    const webSocket = new WebSocket(this._URL)
    this._ws = webSocket

    webSocket.once('error', (error) => {
      if (!callbackCalled) {
        callbackCalled = true
        callback(error)
      }
    })

    webSocket.once('open', () => {
      // Work around Eris DB bug: https://github.com/eris-ltd/eris-db/issues/271
      const convertIdToString = (request) =>
        R.assoc('id', String(request.id), request)

      const addErisDbNamespace = (request) =>
        R.assoc('method', 'erisdb.' + request.method, request)

      // Eris DB wants named parameters, sigh.
      const positionToNamedParameters = (request) =>
        R.assoc('params', request.params[0], request)

      // Work around Eris DB bug: https://github.com/eris-ltd/eris-db/issues/270
      const removeNullError = (response) =>
        response.error === null
          ? R.dissoc('error', response)
          : response

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

      const transport = R.pipe(
        I.map(R.pipe(
          convertIdToString,
          addErisDbNamespace,
          positionToNamedParameters,
          JSON.stringify
        )),
        webSocketPipe(webSocket),
        I.map(R.compose(removeNullError, JSON.parse))
      )

      const client = jsonRpc.client({
        methodNames,
        transport
      })

      // Our API expects callbacks instead of promises so wrap each method.
      const wrapMethod = (method) =>
        function () {
          const callback = I.get(-1, arguments)

          method.apply(null, I.slice(0, -1, arguments)).then(
            (value) => callback(null, value),
            (reason) => callback(reason)
          )
        }

      webSocketClient.methods = I.map(
        (property) => [property[0], wrapMethod(property[1])],
        client.methods
      )

      if (!callbackCalled) {
        R.pipe(
          I.map((error) => `WebSocket client error: ${error}`),
          I.toNodeStream
        )(client.errors).pipe(process.stderr)

        callbackCalled = true
        callback()
      }
    })
  };

/**
 * Send a message. This method is used for all RPC (RMI) methods.
 *
 * @param {string} method - The method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 *
 * @override
 */
WebSocketClient.prototype.send = function (method, params, callback) {
    if (!this._isRunning) {
        throw new Error("The websocket service has not been started.");
    }
    var id = this._nextId();
    var req = rpc.request(id, method, params);
    var reqs = this._reqs;
    reqs[id] = callback;
    this._ws.send(JSON.stringify(req));
};

/**
 * Register a function that is called when the websocket connection closes.
 *
 * @param {function} callback - A zero-argument function.
 */
WebSocketClient.prototype.setCloseCallback = function (callback) {
    this._userCallback = callback;
};

/**
 * Function used for reconnecting with the blockchain-server. If there is a connection already
 * active, this function will replace it with a new one.
 *
 * @param {function} callback - function(error). called when the new connection has been established (or if it failed).
 *
 * @override
 */
WebSocketClient.prototype.reconnect = function (callback) {
    if (this._isRunning){
        this._reconnectCallback = callback;
        this._ws.terminate();
    } else {
        this._start(callback);
    }
};

/**
 *
 * @param {netShutdownCallback} callback - Called when everything has been shut down.
 *
 * @override
 */
WebSocketClient.prototype.shutDown = function(callback){
    if (this._isRunning){
        this._shutdownCallback = callback;
        this._ws.terminate();
    } else {
        console.log("Tried to shut down a non-running websocket-client.");
        callback();
    }
};
