/**
 * @file thelonious.js
 * @fileOverview Factory module for the Thelonious class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module thelonious
 */

'use strict';

var accounts = require('./accounts');
var blockChain = require('./blockchain');
var consensus = require('./consensus');
var events = require('./events');
var network = require('./network');
var transactions = require('./transactions');

/**
 * Create a new instance of the Thelonious class.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end object.
 * @returns {Thelonious} - A new instance of the Thelonious class.
 */
exports.createInstance = function (backEnd) {
    return new Thelonious(backEnd);
};

/**
 * The main class.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end object.
 *
 * @constructor
 */
function Thelonious(backEnd) {
    this._backEnd = backEnd;
    this._accounts = accounts.createInstance(backEnd);
    this._blockChain = blockChain.createInstance(backEnd);
    this._consensus = consensus.createInstance(backEnd);
    this._events = events.createInstance(backEnd);
    this._network = network.createInstance(backEnd);
    this._transactions = transactions.createInstance(backEnd);
}

/**
 * Start the Thelonious client. This method calls the <tt>start</tt> method on the
 * networking back-end object.
 *
 * @param {module:rpc/backend~netStartCallback} callback - This is called when Thelonious has been started.
 */
Thelonious.prototype.start = function (callback) {
    if (!this._backEnd) {
        throw new Error("Networking back-end object has not been set.");
    }
    this._backEnd.start(callback);
};

/**
 * Shuts down the Thelonious client. This method calls the <tt>shutDown</tt> method on the
 * networking back-end object.
 *
 * @param {module:rpc/backend~netShutdownCallback} callback - This is called when Thelonious has been shut down.
 */
Thelonious.prototype.shutDown = function (callback) {
    if (!this._backEnd) {
        throw new Error("Networking back-end object has not been set.");
    }
    this._backEnd.shutDown(callback);
};

/**
 * Check if Thelonious is running. This method calls the <tt>isRunning</tt> method of
 * the networking back-end object.
 */
Thelonious.prototype.isRunning = function () {
    this._backEnd.isRunning();
};

/**
 * Get the <tt>Accounts</tt> object.
 *
 * @returns {module:accounts~Accounts}
 */
Thelonious.prototype.accounts = function () {
    return this._accounts;
};

/**
 * Get the <tt>BlockChain</tt> object.
 *
 * @returns {module:blockchain~BlockChain}
 */
Thelonious.prototype.blockchain = function () {
    return this._blockChain;
};


/**
 * Get the <tt>Consensus</tt> object.
 *
 * @returns {module:consensus~Consensus}
 */
Thelonious.prototype.consensus = function () {
    return this._consensus;
};

/**
 * Get the <tt>Events</tt> object.
 *
 * @returns {module:events~Events}
 */
Thelonious.prototype.events = function () {
    return this._events;
};

/**
 * Get the <tt>Network</tt> object.
 *
 * @returns {module:network~Network}
 */
Thelonious.prototype.network = function () {
    return this._network;
};


/**
 * Get the <tt>Transactions</tt> object.
 *
 * TODO more
 *
 * @returns {module:transactions~Transactions}
 */
Thelonious.prototype.txs = function () {
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