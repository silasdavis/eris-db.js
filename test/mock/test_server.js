'use strict';

/**
 * @file test_server.js
 * @fileOverview Module wrapper for TestServer.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module test/server
 */

var logger = require('winston');

/**
 * Constructor for the MockServer class.
 * @type {MockServer}
 */
module.exports = MockServer;

/**
 * Start a websocket server.
 *
 * @param {number} [port=8080] - The port
 * @constructor
 */
function MockServer(port){

    /**
     * This is where method handlers are stored.
     *
     * @type {Object.<string, handlerFunction>}
     * @private
     */
    this._handlers = {};

    (function(mockServer){

        var WebSocketServer = require('ws').Server;

        var wss = new WebSocketServer({port: port || 8080});

        wss.on('connection', function connection(ws) {

            ws.on('message', function incoming(message) {
                logger.debug('received: ', message);

                var req;

                try {
                    req = JSON.parse(message);
                } catch (error) {
                    logger.error("Failed to parse message: ", error);
                    return;
                }

                if (!isRequest(req)){
                    logger.error("Message is not a proper json-rpc 2.0 request: ", message);
                    return;
                }

                var method = mockServer._handlers[req.method];

                method(req.params, function(error, result){
                    var resp = {
                        jsonrpc: "2.0",
                        id: req.id,
                        result: null,
                        error: null
                    };
                    if(error){
                        resp.error = error;
                    } else {
                        resp.result = result;
                    }
                    ws.send(JSON.stringify(resp));
                });

            });
        });

    })(this);

    /**
     * Check that an object is a valid Request.
     * @param {*} req - The object.
     * @returns {boolean}
     */
    function isRequest(req){
        // Check params is null or array?
        return req instanceof Object && typeof(req.jsonrpc) === "string" && req.jsonrpc === "2.0" &&
               typeof(req.method) === "string" && typeof(req.id) === "string";
    }

}

/**
 * Add a new handler method.
 *
 * @param {string} method - The method name.
 * @param {handlerFunction} hFunc - The handler function.
 */
MockServer.prototype.addHandler = function(method, hFunc){
    this._handlers[method] = hFunc;
};

/**
 * Remove a handler function.
 * @param {string} method - The method name.
 */
MockServer.prototype.removeHandler = function(method){
    delete this._handlers[method];
};

/**
 * A handler function.
 *
 * @callback handlerFunction
 * @param {?Object} params - the params.
 * @param {handlerCallback} callback - The handler callback function.
 */

/**
 * Callback for websocket handlers.
 *
 * @callback handlerCallback
 * @param {error} error - The error.
 * @param {*} result - The result.
 */

/**
 * A thelonious json-rpc request.
 * @typedef {Object} Request
 * @property {string} jsonrpc - The json-rpc version.
 * @property {string} id - The id.
 * @property {string} method - The method.
 * @property {Array} params - The parameters.
 */

/**
 * A thelonious json-rpc response.
 * @typedef {Object} Response
 * @property {string} jsonrpc - The json-rpc version.
 * @property {string} id - The id.
 * @property {*} result - The result.
 * @property {string} error - The error (if any).
 */