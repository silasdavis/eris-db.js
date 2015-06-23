/**
 * @file mock_client.js
 * @fileOverview Module wrapper for MockClient.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module test/client
 */

var client = require('../../lib/rpc/client');

/**
 *
 * @param {Object} handlers - The handler functions.
 * @returns {MockClient}
 */
exports.createInstance = function(handlers){
    return new MockClient(handlers);
};

/**
 * Create a mock client.
 * @augments module:rpc/client~Client
 * @constructor
 */
function MockClient(handlers){
    client.Client.call(this, "mock");
    this._handlers = handlers;
}

/**
 * TODO
 *
 * Send a message. This method will get its data from a test data object.
 *
 * @param {string} method - The method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 * @override
 */
MockClient.prototype.send = function(method, params, callback){
    if(!this._handlers.hasOwnProperty(method)){
        callback(new Error("Method does not exist."));
        return;
    }
    var handler = this._handlers[method];
    callback(null, handler(params));
};