/**
 * @file: unsafe.js
 * @fileOverview: Factory module for the Unsafe class.
 * @author: Andreas Olofsson (andreas@erisindustries.com)
 * @module: unsafe
 */

'use strict';

var util = require('./util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the Unsafe class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @returns {Unsafe} - A new instance of the Unsafe class.
 */
exports.createInstance = function (client, validator) {
    return new Unsafe(client, validator);
};

/**
 * Unsafe is used to call functions that require extra safety precautions. These usually involve
 * transmitting or receiving a private key.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @constructor
 */
function Unsafe(client, validator) {
    util.ComponentBase.call(this, client);
    this._validator = validator;
}

/**
 * Generate an account.
 *
 * NOTE: This requires a private key to be sent from the server to the client.
 *
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.genPrivAccount = function (context, callback) {
    if (!this._validator.validate(context)){
        callback(new Error("Validation failed"));
    }
    this._client.send(rpc.methodName("genPrivAccount"), null, callback);
};

/**
 * Sign a transaction.
 *
 * NOTE: This requires one or more private keys to be sent to the server.
 *
 * @param {Object} tx - The transaction object.
 * @param {Object[]} privAccounts - The private accounts.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.signTx = function (tx, privAccounts, context, callback) {
    if (!this._validator.validate(context)){
        callback(new Error("Validation failed"));
    }
    this._client.send(rpc.methodName("signTx"), rpc.signTxParam(tx, privAccounts), callback);
};

/**
 * Transact to the account at the given address.
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} address - The address to the account holding the code. Set it to null if
 * doing a tx create.
 * @param {string} data - The input data.
 * @param {number} gasLimit - The gas limit.
 * @param {number} fee - The fee.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.transact = function (privKey, address, data, gasLimit, fee, context, callback) {
    if (!this._validator.validate(context)){
        callback(new Error("Validation failed"));
    }
    if(!util.isPrivKey(privKey)) {
        callback(new Error("'privKey' is not a proper private key string."));
    }
    if(address !== ""){
        if(!util.isAddress(address)) {
            callback(new Error("'address' is not a proper address string."));
        }
    }
    if(!util.isHex(data)) {
        callback(new Error("'data' is not a proper hex string."));
    }
    var param = rpc.transactParam(privKey, address, data, gasLimit, fee);
    this._client.send(rpc.methodName("transact"), param, callback);
};

/**
 * Set a new validator object.
 *
 * @param {module:validation~Validator} validator - The validator object.
 */
Unsafe.prototype.setValidator = function (validator) {
    return this._validator = validator;
};