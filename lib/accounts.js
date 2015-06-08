/**
 * @file accounts.js
 * @fileOverview Factory module for the Accounts class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module accounts
 */

'use strict';

var util = require('./util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the Account class.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end object.
 * @returns {Accounts} - A new instance of the Accounts class.
 */
exports.createInstance = function (backEnd) {
    return new Accounts(backEnd);
};

/**
 * Chain is used to work with accounts and their related data.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Accounts(backEnd) {
    util.ComponentBase.call(this, backEnd);
}

/**
 * Get a list of accounts.
 * // TODO document
 * @param {module:util~FieldFilter|module:util~FieldFilter[]} [filter] - Filter the search.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Accounts.prototype.getAccounts = function (filter, callback) {
    if(typeof(filter) === "function"){
        this._backEnd.send(rpc.methodName("getAccounts"), rpc.accountsParam(null), filter);
    } else if (filter === null && typeof(callback) == "function") {
        this._backEnd.send(rpc.methodName("getAccounts"), rpc.accountsParam(null), callback);
    } else {
        if(!(filter instanceof Array)){
            filter = [filter];
        }
        var param = rpc.accountsParam(filter);
        this._backEnd.send(rpc.methodName("getAccounts"), param, callback);
    }

};

/**
 * Get the account with the given address.
 *
 * @param {string} address - The account address.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Accounts.prototype.getAccount = function (address, callback) {
    if(!util.isAddress(address)){
        callback(new Error("'address' is not a proper address string."));
        return;
    }
    this._backEnd.send(rpc.methodName("getAccount"), rpc.addressParam(address), callback);
};

/**
 * Get the storage of the account with the given address. If this account is not a
 * contract account the storage will be empty.
 *
 * NOTE: This is for dev. To access data in contract account storage, use the proper
 * accessor function.
 *
 * @param {string} address - The account address.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Accounts.prototype.getStorage = function (address, callback) {
    if(!util.isAddress(address)){
        callback(new Error("'address' is not a proper address string."));
        return;
    }
    this._backEnd.send(rpc.methodName("getStorage"), rpc.addressParam(address), callback);
};

/**
 * Get the data corresponding to the given key in the account with the given address.
 *
 * NOTE: This is for dev. To access data in contract account storage, use the proper
 * accessor function.
 *
 * @param {string} address - The account address.
 * @param {string} key - The key.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Accounts.prototype.getStorageAt = function (address, key, callback) {
    if(!util.isAddress(address)){
        callback(new Error("'address' is not a proper address string."));
        return;
    }
    if(!util.isHex(key)){
        callback(new Error("'key' is not a proper hex string."));
        return;
    }
    this._backEnd.send(rpc.methodName("getStorageAt"), rpc.storageAtParam(address, key), callback);
};