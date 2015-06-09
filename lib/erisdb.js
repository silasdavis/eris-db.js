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

/**
 * Create a new instance of the ErisDB class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @returns {ErisDB} - A new instance of the ErisDB class.
 */
exports.createInstance = function (client) {
    return new ErisDB(client);
};

/**
 * The main class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 *
 * @constructor
 */
function ErisDB(client) {
    this._client = client;
    this._accounts = accounts.createInstance(client);
    this._blockChain = blockChain.createInstance(client);
    this._consensus = consensus.createInstance(client);
    this._events = events.createInstance(client);
    this._network = network.createInstance(client);
    this._transactions = transactions.createInstance(client);
}

/**
 * Start the ErisDB client. This method calls the <tt>start</tt> method on the client.
 *
 * @param {module:rpc/client~netStartCallback} callback - This is called when ErisDB has been started.
 */
ErisDB.prototype.start = function (callback) {
    if (!this._client) {
        throw new Error("Networking client object has not been set.");
    }
    this._client.start(callback);
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
 * TODO more
 *
 * @returns {module:transactions~Transactions}
 */
ErisDB.prototype.txs = function () {
    return this._transactions;
};

/**
 * Used to allow or disallow calls that send or receive private keys.
 * @constructor
 */
function CallValidator() {
}

/**
 * Validate a call.
 *
 * @param {*} [context] - Wildcard for implementation-specific input.
 * @returns {boolean}
 */
CallValidator.prototype.validate = function (context) {
    return false
};

/**
 * Validator that allows or disallows based on the provided value.
 *
 * @param {boolean} policy - Do we allow private keys to be passed over the channel or not?
 * @augments CallValidator
 * @constructor
 */
function SinglePolicyValidator(policy) {
    this._policy = policy;
}

/**
 * Validate a function call based on the policy.
 *
 */
SinglePolicyValidator.prototype.validate = function () {
    return this._policy;
};