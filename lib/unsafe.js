/**
 * @file unsafe.js
 * @fileOverview Factory module for the Unsafe class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module unsafe
 */

'use strict'

var Promise = require('bluebird')
var util = require('./util')
var nUtil = require('util')
var R = require('ramda')
var rpc = require('./rpc/rpc')
const transactions = require('./pure/transaction')

/**
 * Create a new instance of the Unsafe class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @returns {Unsafe} - A new instance of the Unsafe class.
 */
exports.createInstance = function (erisDb, client, validator) {
  return new Unsafe(erisDb, client, validator)
}

/**
 * Unsafe is used to call functions that require extra safety precautions. These usually involve
 * transmitting or receiving a private key.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:validation~Validator} validator - The validator object.
 * @constructor
 */
function Unsafe (erisDb, client, validator) {
  util.ComponentBase.call(this, client)
  this.erisDb = erisDb
  this._validator = validator
}

nUtil.inherits(Unsafe, util.ComponentBase)

/**
 * Generate an account.
 *
 * NOTE: This requires a private key to be sent from the server to the client.
 *
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.genPrivAccount = function (context, callback) {
  if (!this._validator.validate(context)) {
    callback(new Error('Validation failed'))
  }
  this._client.send(rpc.methodName('genPrivAccount'), null, callback)
}

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
  if (!this._validator.validate(context)) {
    callback(new Error('Validation failed'))
  }
  if (!util.isPrivKey(privKey)) {
    callback(new Error("'privKey' is not a proper private key string."))
  }
  if (address !== '') {
    if (!util.isAddress(address)) {
      callback(new Error("'address' is not a proper address string."))
    }
  }
  if (!util.isHex(data)) {
    callback(new Error("'data' is not a proper hex string."))
  }
  var param = rpc.transactParam(privKey, address, data, gasLimit, fee)
  this._client.send(rpc.methodName('transact'), param, callback)
}

/**
 * Transact to the account at the given address, and hold until the transaction has
 * been committed to a block (or not).
 *
 * @param {string} user - The user account address that will be used to sign.
 * @param {string} address - The address to the account holding the code. Set it to null if
 * doing a tx create.
 * @param {string} data - The input data.
 * @param {number} gasLimit - The gas limit.
 * @param {number} fee - The fee.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.transactAndHold = function (user, address, data, gasLimit, fee, context, callback) {
  const erisDb = this.erisDb

  if (!this._validator.validate(context)) {
    callback(new Error('Validation failed'))
  }

  if (address !== '') {
    if (!util.isAddress(address)) {
      callback(new Error("'address' is not a proper address string."))
    }
  }
  if (!util.isHex(data)) {
    callback(new Error("'data' is not a proper hex string."))
  }

  var fixedCallback = function (error, data2) {
    if (error) {
      callback(error)
    } else {
      data2 = data2[1]
      callback(null, data2)
    }
  }

  erisDb.keyServer.publicKeyFor({address: user})
    .then(function (publicKey) {
      return Promise.fromCallback(function (callback) {
        return erisDb.accounts().getAccount(user, callback)
      }).get('sequence').then(function (sequence) {
        const input = transactions.Input(user, 1, sequence + 1, publicKey)

        const call = transactions.Call(erisDb.name, address, data, gasLimit,
          fee, input)

        console.log(String(call))

        return erisDb.keyServer.sign(String(call), {address: user})
          .then(function (signature) {
            const transaction = R.assocPath(
              ['input', 'signature'],
              [1, signature.toString('hex')],
              call
            )

            console.log(JSON.stringify(transaction.toJson(), null, 2))

            return Promise.fromCallback(
              callback => erisDb.txs().broadcastTx(transaction.toJson(),
                callback)
            )
          })
      })
    }).then(fixedCallback)
}

/**
 * Send to the account at the given address.
 *
 * Note: This requires a private key to be sent to the blockchain client.
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} toAddress - The target account address.
 * @param {number} amount - The amount to send.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.send = function (privKey, toAddress, amount, context, callback) {
  if (!this._validator.validate(context)) {
    callback(new Error('Validation failed'))
  }
  if (!util.isPrivKey(privKey)) {
    callback(new Error("'privKey' is not a proper private key string."))
  }
  if (toAddress !== '') {
    if (!util.isAddress(toAddress)) {
      callback(new Error("'address' is not a proper address string."))
    }
  }
  var param = rpc.sendParam(privKey, toAddress, amount)
  this._client.send(rpc.methodName('send'), param, callback)
}

/**
 * Transact to the account at the given address, and hold until the transaction has
 * been committed to a block (or not).
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} toAddress - The target account address.
 * @param {number} amount - The amount to send.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.sendAndHold = function (privKey, toAddress, amount, context, callback) {
  if (!this._validator.validate(context)) {
    callback(new Error('Validation failed'))
  }
  if (!util.isPrivKey(privKey)) {
    callback(new Error("'privKey' is not a proper private key string."))
  }
  if (toAddress !== '') {
    if (!util.isAddress(toAddress)) {
      callback(new Error("'address' is not a proper address string."))
    }
  }
  var param = rpc.sendParam(privKey, toAddress, amount)
  this._client.send(rpc.methodName('sendAndHold'), param, callback)
}

/**
 * Transact to the name registry. The name registry is essentially a distributed key-value store that comes
 * with the client. Accessing the registry is done via the NameReg.
 *
 * Note: This requires a private key to be sent to the server.
 *
 * @param {string} privKey - The private key that will be used to sign.
 * @param {string} name - The key, or name.
 * @param {string} data - The data that should be stored.
 * @param {number} amount - The amount of tokens to send.
 * @param {number} fee - The fee.
 * @param {*} context - an object containing information for the validator.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Unsafe.prototype.transactNameReg = function (privKey, name, data, amount, fee, context, callback) {
  if (!this._validator.validate(context)) {
    callback(new Error('Validation failed'))
  }
  if (!util.isPrivKey(privKey)) {
    callback(new Error("'privKey' is not a proper private key string."))
  }
  // 'name' must be a non-empty string.
  if (!name || typeof (name) !== 'string') {
    callback(new Error("'name' is empty."))
  }
  // 'data' must be a string.
  if (typeof (data) !== 'string') {
    callback(new Error("'data' is not a string."))
  }
  var param = rpc.transactNameRegParam(privKey, name, data, amount, fee)
  this._client.send(rpc.methodName('transactNameReg'), param, callback)
}

/**
 * Set a new validator object.
 *
 * @param {module:validation~Validator} validator - The validator object.
 */
Unsafe.prototype.setValidator = function (validator) {
  this._validator = validator
}
