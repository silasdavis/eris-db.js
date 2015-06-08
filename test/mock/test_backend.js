/**
 * @file test_backend.js
 * @fileOverview Module wrapper for TestBackEnd.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module test/backend
 */

var logger = require('winston');
var backEnd = require('../lib/rpc/back_end');

/**
 * Constructor for the TestBackEnd class.
 * @type {TestBackEnd}
 */
module.exports = TestBackEnd;

/**
 * Create a dummy networking back-end.
 * @augments module:rpc/backend~Client
 * @constructor
 */
function TestBackEnd(){
    backEnd.NetworkingBackEnd.call("");
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
TestBackEnd.prototype.send = function(method, params, callback){
    // TODO
};