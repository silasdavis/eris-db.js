/**
 * @file erisdb.js
 * @fileOverview Factory module for the ErisDB class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module erisdb
 */

'use strict';

var accounts = require('./accounts');
var blockChain = require('./blockchain');
var consensus = require('./consensus');
var events = require('./events');
var network = require('./network');
var transactions = require('./transactions');
var unsafe = require('./unsafe');

/**
 * Create a new instance of the ErisDB class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @param {boolean} useWebSockets - whether or not websockets are used. Temporary.
 * @returns {ErisDB} - A new instance of the ErisDB class.
 */
exports.createInstance = function (client, validator, useWebSockets) {
    return new ErisDB(client, validator, useWebSockets);
};

/**
 * The main class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @param {boolean} useWebSockets - whether or not websockets are used. Temporary.
 * @constructor
 */
function ErisDB(client, validator, useWebSockets) {
    this._client = client;
    var usf = unsafe.createInstance(client, validator);
    this._unsafe = usf;
    this._accounts = accounts.createInstance(client, usf);
    this._blockChain = blockChain.createInstance(client);
    this._consensus = consensus.createInstance(client);
    this._events = events.createInstance(client, useWebSockets);
    this._network = network.createInstance(client);
    this._transactions = transactions.createInstance(client, usf);
}

/**
 * Start the ErisDB client. This method calls the <tt>start</tt> method on the client.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function. The data param is the
 * erisdb instance itself.
 */
ErisDB.prototype.start = function (callback) {
    if (!this._client) {
        throw new Error("Networking client object has not been set.");
    }
    var that = this;
    this._client.start(function(error){
        if (error) {
            callback(error);
        } else {
            callback(null, that);
        }

    })
};

/**
 * Shuts down the ErisDB client. This method calls the <tt>shutDown</tt> method on the client.
 *
 * @param {module:rpc/client~netShutdownCallback} callback - This is called when ErisDB has been shut down.
 */
ErisDB.prototype.shutDown = function (callback) {
    if (!this._client) {
        throw new Error("Networking client object has not been set.");
    }
    this._client.shutDown(callback);
};

/**
 * Check if ErisDB is running. This method calls the <tt>isRunning</tt> method of
 * the networking client.
 */
ErisDB.prototype.isRunning = function () {
    this._client.isRunning();
};

/**
 * Get the <tt>Accounts</tt> object.
 *
 * @returns {module:accounts~Accounts}
 */
ErisDB.prototype.accounts = function () {
    return this._accounts;
};

/**
 * Get the <tt>BlockChain</tt> object.
 *
 * @returns {module:blockchain~BlockChain}
 */
ErisDB.prototype.blockchain = function () {
    return this._blockChain;
};


/**
 * Get the <tt>Consensus</tt> object.
 *
 * @returns {module:consensus~Consensus}
 */
ErisDB.prototype.consensus = function () {
    return this._consensus;
};

/**
 * Get the <tt>Events</tt> object.
 *
 * @returns {module:events~Events}
 */
ErisDB.prototype.events = function () {
    return this._events;
};

/**
 * Get the <tt>Network</tt> object.
 *
 * @returns {module:network~Network}
 */
ErisDB.prototype.network = function () {
    return this._network;
};


/**
 * Get the <tt>Transactions</tt> object.
 *
 * @returns {module:transactions~Transactions}
 */
ErisDB.prototype.txs = function () {
    return this._transactions;
};

/**
 * Set a new validator object.
 *
 * @param {module:validation~Validator} validator - The validator object.
 */
ErisDB.prototype.setValidator = function (validator) {
    return this._unsafe.setValidator(validator);
};