/**
 * @file mock_client.js
 * @fileOverview Module wrapper for MockClient.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module test/client
 */

var client = require('../lib/rpc/client');

/**
 * Constructor for the MockClient class.
 * @type {MockClient}
 */
module.exports = MockClient;

/**
 * Create a mock client.
 * @augments module:rpc/client~Client
 * @constructor
 */
function MockClient(){
    client.Client.call("");
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
    // TODO
};