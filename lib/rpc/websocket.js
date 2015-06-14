/**
 * @file websocket.js
 * @fileOverview Factory module for the websocket client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/websocket
 */
'use strict';

var client = require('./client');
var rpc = require('./rpc');
var WS;
if (typeof(window) !== "undefined"){
    WS = WebSocket;
} else {
    WS = require('ws');
}

/**
 * Create a new instance of the WebSocketClient class.
 * @param {string} URL - The endpoint URL
 * @returns {WebSocketClient}
 */
exports.createInstance = function(URL){
    return new WebSocketClient(URL);
};

/**
 * The <tt>WebSocketClient</tt> class does RPCs over websocket.
 *
 * @param {string} URL - The endpoint URL.
 * @augments module:rpc/client~Client
 * @constructor
 */
function WebSocketClient(URL){
    client.Client.call(this, URL);
    /**
     * Storing requests until their responses comes back.
     *
     * @type TODO
     *
     * @private
     */
    this._reqs = {};

    /**
     * Storing requests permanently, until manually removed.
     *
     * @type TODO
     *
     * @private
     */
    this._reqsPerm = {};

    /**
     * The current request id. It is incremented by 1 for each request that's made.
     *
     * @type {number}
     *
     * @private
     */
    this._currentId = 1;

    /**
     * The websocket client object.
     *
     * @private
     */
    this._ws = null;
}

/**
 * Start the websocket service.
 *
 * @param {module:rpc/client~netStartCallback} callback - Called when connected to the RPC server.
 *
 * @override
 */
WebSocketClient.prototype.start = function(callback){
    this._ws = new WS(this._URL);

    (function(wsep){

        if (typeof(window) !== "undefined") {
            wsep._ws.onopen = open;
            wsep._ws.onmessage = function(evt){message(evt.data)};
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
                console.log(data);
                return;
            }

            if (!rpc.isResponse(resp)) {
                console.error("Response object is not a proper json-rpc 2.0 response object.");
                return;
            }
            var cFunc = wsep._reqs[resp.id];
            if (!cFunc) {
                cFunc = wsep._reqsPerm[resp.id];
                if(!cFunc) {
                    console.error("Response object does not have a callback.");
                    return;
                }
            } else {
                delete wsep._reqs[resp.id];
            }

            if (!resp.error){
                cFunc(null, resp.result);
            } else {
                rpc.printError(resp);
                cFunc(resp.error);
            }
        }

        // When the connection is shut down.
        // TODO some teardown.
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
WebSocketClient.prototype.send = function(method, params, callback){
    if(!this._isRunning){
        throw new Error("The websocket service has not been started.");
    }
    var id = this._nextId();
    var req = rpc.request(id, method, params);
    var reqs = this._reqs;
    reqs[id] = callback;
    this._ws.send(JSON.stringify(req));
};

/**
 * TODO
 *
 * @param {netShutdownCallback} callback - Called when everything has been shut down.
 *
 * @override
 */
WebSocketClient.prototype.shutDown = function(callback){
    this._isRunning = false;
    callback();
};

/**
 * Get the next id.
 *
 * @returns {string} id - The id as a string.
 *
 * @private
 */
WebSocketClient.prototype._nextId = function(){
    return (this._currentId++).toString();
};