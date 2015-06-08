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
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end object.
 * @returns {Transactions} - A new instance of the Transactions class.
 */
exports.createInstance = function (backEnd) {
    return new Transactions(backEnd);
};

/**
 * Transactions has methods for sending transactions, viewing currently pending ones etc.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Transactions(backEnd) {
    util.ComponentBase.call(this, backEnd);
}

/**
 * Get a list of all unconfirmed transactions.
 *
 * @param {methodCallback} callback - The callback function.
 */
Transactions.prototype.getUnconfirmedTxs = function (callback) {
    this._backEnd.send(rpc.methodName("getUnconfirmedTxs"), null, callback);
};

/**
 * Broadcasting a Transaction will send it to the blockchain client. The transaction needs
 * to be signed in order for this to work.
 *
 * @param {Object} tx - The transaction.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.broadcastTx = function (tx, callback) {
    this._backEnd.send(rpc.methodName("broadcastTx"), tx, callback);
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
    this._backEnd.send(rpc.methodName("call"), rpc.callParam(address, data), callback);
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
    this._backEnd.send(rpc.methodName("callCode"), rpc.callCodeParam(code, data), callback);
};

/**
 * Transact to the account at the given address.
 *
 * @param privKey - The private key that will be used to sign.
 * @param address - The address to the account holding the code. Set it to null if
 * doing a tx create.
 * @param data - The input data.
 * @param gasLimit - The gas limit.
 * @param fee - The fee.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Transactions.prototype.transact = function (privKey, address, data, gasLimit, fee, callback) {
    if(!util.isPrivKey(privKey)) {
        callback(new Error("'privKey' is not a proper private key string."));
    }
    console.log("TARGET ADDRESS: " + address);
    if(address !== ""){
        if(!util.isAddress(address)) {
            callback(new Error("'address' is not a proper address string."));
        }
    }
    if(!util.isHex(data)) {
        callback(new Error("'data' is not a proper hex string."));
    }
    var param = rpc.transactParam(privKey, address, data, gasLimit, fee);
    console.log(param);
    this._backEnd.send(rpc.methodName("transact"), param, callback);
};