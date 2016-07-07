/**
 * @file erisdb.js
 * @fileOverview Factory module for the ErisDB class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module erisdb
 */

'use strict'

var accountsF = require('./accounts')
var blockChainF = require('./blockchain')
var consensusF = require('./consensus')
var eventsF = require('./events')
var index = require('./')
var keys = require('./keys')
var nameregF = require('./namereg')
var networkF = require('./network')
var Promise = require('bluebird')
var R = require('ramda')
var transactionsF = require('./transactions')
var unsafeF = require('./unsafe')
var url = require('url')
var validation = require('./validation')
var WebSocketClient = require('./rpc/websocket')

exports.open = function (name, options) {
  options = options || {}

  return Promise.join(
    index.serviceUrl('services', 'keys', 4767).then(keys.open),
    index.serviceUrl('chains', name, 1337),
    function (keyServer, httpUrl) {
      var webSocketUrl
      var client
      var validator
      var db

      webSocketUrl = url.format(R.merge(httpUrl,
        {protocol: 'ws:', pathname: 'socketrpc'}))

      client = options.client || new WebSocketClient(webSocketUrl)
      validator = new validation.SinglePolicyValidator(true)
      db = new ErisDB(client, validator)
      db.name = name
      db.keyServer = keyServer
      db.user = options.user

      return Promise.promisify(db._client.start, {context: db._client})()
        .return(db)
    })
}

/**
 * The main class.
 *
 * @param {module:rpc/client-Client} client - The networking client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @constructor
 */
function ErisDB (client, validator) {
  if (typeof (validator) === 'undefined' || validator === null) {
    validator = new validation.SinglePolicyValidator(true)
  }
  this._client = client
  var unsafe = unsafeF.createInstance(client, validator)
  var events = eventsF.createInstance(client)

  var accounts = accountsF.createInstance(client, unsafe, this)
  var blockChain = blockChainF.createInstance(client)
  var consensus = consensusF.createInstance(client)
  var namereg = nameregF.createInstance(client, unsafe, events)
  var network = networkF.createInstance(client)
  var transactions = transactionsF.createInstance(client, unsafe)

  this._unsafe = unsafe
  this._accounts = accounts
  this._blockChain = blockChain
  this._consensus = consensus
  this._events = events
  this._namereg = namereg
  this._network = network
  this._transactions = transactions
}

/**
 * Shuts down the ErisDB client. This method calls the <tt>shutDown</tt> method on the client.
 *
 * @param {module:rpc/client~netShutdownCallback} callback - This is called when ErisDB has been shut down.
 */
ErisDB.prototype.close = function (callback) {
  if (!this._client) {
    throw new Error('Networking client object has not been set.')
  }
  this.keyServer.close()
  this._client.shutDown(callback)
}

/**
 * Check if ErisDB is running. This method calls the <tt>isRunning</tt> method of
 * the networking client.
 */
ErisDB.prototype.isRunning = function () {
  this._client.isRunning()
}

/**
 * Get the <tt>Accounts</tt> object.
 *
 * @returns {module:accounts~Accounts}
 */
ErisDB.prototype.accounts = function () {
  return this._accounts
}

/**
 * Get the <tt>BlockChain</tt> object.
 *
 * @returns {module:blockchain~BlockChain}
 */
ErisDB.prototype.blockchain = function () {
  return this._blockChain
}

/**
 * Get the <tt>Consensus</tt> object.
 *
 * @returns {module:consensus~Consensus}
 */
ErisDB.prototype.consensus = function () {
  return this._consensus
}

/**
 * Get the <tt>Events</tt> object.
 *
 * @returns {module:events~Events}
 */
ErisDB.prototype.events = function () {
  return this._events
}

/**
 * Get the <tt>NameReg</tt> object.
 *
 * @returns {module:namereg~NameReg}
 */
ErisDB.prototype.namereg = function () {
  return this._namereg
}

/**
 * Get the <tt>Network</tt> object.
 *
 * @returns {module:network~Network}
 */
ErisDB.prototype.network = function () {
  return this._network
}

/**
 * Get the <tt>Transactions</tt> object.
 *
 * @returns {module:transactions~Transactions}
 */
ErisDB.prototype.txs = function () {
  return this._transactions
}

/**
 * Set a new validator object.
 *
 * @param {module:validation~Validator} validator - The validator object.
 */
ErisDB.prototype.setValidator = function (validator) {
  return this._unsafe.setValidator(validator)
}
