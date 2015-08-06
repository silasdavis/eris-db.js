/**
 * @file websocket.js
 * @fileOverview Factory module for the websocket client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/websocket
 */
'use strict';

var TWCClient = require('./twc_client');
var nUtil = require('util');
var rpc = require('./rpc');

var WS;
if (typeof(window) !== "undefined") {
    WS = WebSocket;
} else {
    WS = require('ws');
}

module.exports = WebSocketClient;

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
    this._ws = null;
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
    this._ws = new WS(this._URL);

    (function (wsep) {

        if (typeof(window) !== "undefined") {
            wsep._ws.onopen = open;
            wsep._ws.onmessage = function (evt) {
                message(evt.data)
            };
            wsep._ws.onclose = close;
        } else {
            wsep._ws.on('open', open);
            wsep._ws.on('message', message);
            wsep._ws.on('close', close);
        }

        // When the connection is established.
        function open() {
            console.log("Websocket connection established.");
            wsep._isRunning = true;
            callback();
        }

        // When a message arrives.
        function message(data) {

            var resp;
            try {
                resp = JSON.parse(data);
            } catch (err) {
                console.error("Error when parsing websocket response: " + err);
                console.error(data);
                return;
            }

            if(typeof(resp.id) !== "string"){
                console.error("rpc response has no id: " + data);
                return;
            }

            // If the callback for this function is temporary (stored in _reqs).
            var temp = true;

            var cFunc = wsep._reqs[resp.id];
            if (!cFunc) {
                cFunc = wsep._callbacks[resp.id];
                if (!cFunc) {
                    console.error("Response object does not have a callback: " + data);
                    return;
                }
                temp = false;
            }

            if (!rpc.isResponse(resp)) {
                cFunc(new Error("Response object is not a proper json-rpc 2.0 response object."));
                return;
            }

            if (!resp.error) {
                cFunc(null, resp.result);
            } else {
                rpc.printError(resp);
                cFunc(new Error(resp.error.message));
            }

            if(temp) {
                delete wsep._reqs[resp.id];
            }
        }

        // When the connection is shut down.
        // TODO
        function close() {
            console.log("Websocket connection closed.");
        }

    })(this);
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