/**
 * @file namereg.js
 * @fileOverview Factory module for the NameReg class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module namereg
 */

'use strict';

var util = require('./util');
var nUtil = require('util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the NameReg class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {NameReg} - A new instance of the NameReg class.
 */
exports.createInstance = function (client) {
    return new NameReg(client);
};

/**
 * NameReg is used to work with the name registry.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function NameReg(client) {
    util.UnsafeComponentBase.call(this, client);
}

nUtil.inherits(NameReg, util.UnsafeComponentBase);

/**
 * Get a list of entries.
 *
 * @param {module:util~FieldFilter|module:util~FieldFilter[]} [filter] - Filter the search.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
NameReg.prototype.getEntries = function (filter, callback) {
    var f, c;
    if(typeof(filter) === "function"){
        f = [];
        c = filter;
    } else if (!filter && typeof(callback) == "function") {
        f = [];
        c = callback;
    } else {
        if(!(filter instanceof Array)){
            f = [filter];
        } else {
            f = filter;
        }
        c = callback;
    }
    this._client.send(rpc.methodName("getNameRegEntries"), rpc.filtersParam(f), c);
};

/**
 * Get the account with the given address.
 *
 * @param {string} name - The account address.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
NameReg.prototype.getEntry = function (name, callback) {
    if(!name || typeof(name) !== "string"){
        callback(new Error("'name' is not a non-empty string."));
        return;
    }
    this._client.send(rpc.methodName("getNameRegEntry"), rpc.nameRegNameParam(name), callback);
};