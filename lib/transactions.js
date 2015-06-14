/**
 * @file transactions.js
 * @fileOverview Factory module for the Transactions class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module transactions
 */
'use strict';

var util = require('./util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the Transactions class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @returns {Transactions} - A new instance of the Transactions class.
 */
exports.createInstance = function (client, unsafe) {
    return new Transactions(client, unsafe);
};

/**
 * Transactions has methods for sending transactions, viewing currently pending ones etc.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Transactions(client, unsafe) {
    util.ComponentBase.call(this, client);
    this._unsafe = unsafe;
}

/**
 * Get a list of all unconfirmed transactions.
 *
 * @param {methodCallback} callback - The callback function.
 */
Transactions.prototype.getUnconfirmedTxs = function (callback) {
    this._client.send(rpc.methodName("getUnconfirmedTxs"), null, callback);
};

/**
 * Broadcasting a Transaction will send it to the blockchain client. The transaction needs
 * to be signed in order for this to work.
 *
 * @param {Object} tx - The transaction.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.broadcastTx = function (tx, callback) {
    this._client.send(rpc.methodName("broadcastTx"), tx, callback);
};

/**
 * Call the account at the given address. If there is no code in the account, this will do nothing.
 * Call does not cost anything, and can not affect the state of the database. It is only used to
 * <tt>get</tt> data.
 *
 * @param {string} address - The address to the account holding the code.
 * @param {string} data - The input data.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.call = function (address, data, callback) {
    if(!util.isAddress(address)) {
        callback(new Error("'address' is not a proper address string."));
    }
    if(!util.isHex(data)) {
        callback(new Error("'data' is not a proper hex string."));
    }
    this._client.send(rpc.methodName("call"), rpc.callParam(address, data), callback);
};

/**
 * Call the code with the given data as input. This function runs the code in a VM
 * with the given input.
 *
 * @param {string} code - The code to be executed.
 * @param {string} data - The input data.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.callCode = function (code, data, callback) {
    if(!util.isHex(code)) {
        callback(new Error("'code' is not a proper hex string."));
    }
    if(!util.isHex(data)) {
        callback(new Error("'data' is not a proper hex string."));
    }
    this._client.send(rpc.methodName("callCode"), rpc.callCodeParam(code, data), callback);
};

/**
 * Transact to the account at the given address.
 *
 * Note: This requires a private key to be sent to the server.
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
Transactions.prototype.transact = function (privKey, address, data, gasLimit, fee, context, callback) {
    this._unsafe.transact(privKey, address, data, gasLimit, fee, context, callback)
};