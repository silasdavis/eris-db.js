/**
 * @file accounts.js
 * @fileOverview Factory module for the Accounts class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module accounts
 */

'use strict'

var assert = require('assert')
var canonicalJson = require('canonical-json')
var jayson = require('jayson/promise')
var Promise = require('bluebird')
var util = require('./util')
var nUtil = require('util')
var R = require('ramda')
var rpc = require('./rpc/rpc')

/*
Tendermint uses its own custom JSON.stringify function that doesn't generate
valid JSON so we have to replicate it here.

func (tx *PermissionsTx) WriteSignBytes(chainID string, w io.Writer, n *int64,
  err *error) {
	wire.WriteTo([]byte(Fmt(`{"chain_id":%s`, jsonEscape(chainID))), w, n, err)
	wire.WriteTo([]byte(Fmt(`,"tx":[%v,{"args":"`, TxTypePermissions)), w, n, err)
	wire.WriteJSON(tx.PermArgs, w, n, err)
	wire.WriteTo([]byte(`","input":`), w, n, err)
	tx.Input.WriteSignBytes(w, n, err)
	wire.WriteTo([]byte(`}]}`), w, n, err)
}
*/

function writeSignBytes (chainId, type, args, input) {
  return '{"chain_id":' + canonicalJson(chainId) + ',"tx":[' +
  canonicalJson(type) + ',{"args":"' + canonicalJson(args) + '","input":' +
  canonicalJson(input) + '}]}'
}

function createTransaction (type, input, args, signature) {
  return [type, {
    input: R.assoc('signature', signature, input),
    args: args
  }]
}

function createAccount (erisDb, address) {
  return {
    setPermission: function (type, value) {
      return Promise.try(function () {
        assert(erisDb.user, "Can't set permissions unless logged in.")
        assert.equal(type, 'call', 'Unsupported permission type: ' + type)
      }).then(function () {
        return erisDb.keyServer.publicKeyFor({address: erisDb.user})
          .then(function (publicKey) {
            return Promise.fromCallback(function (callback) {
              return erisDb.accounts().getAccount(erisDb.user, callback)
            }).get('sequence').then(function (sequence) {
              var type
              var input
              var args
              var signBytes

              type = 32

              input = {
                address: erisDb.user,
                amount: 1,
                sequence: sequence + 1
              }

              if (sequence === 0) {
                input.pub_key = [1, publicKey]
              }

              args = [
                2,
                {address: address, permission: 4, value: value}
              ]

              signBytes = writeSignBytes(erisDb.name, type, args, input)

              return erisDb.keyServer.sign(signBytes, {address: erisDb.user})
                .then(function (signature) {
                  var transaction

                  transaction = createTransaction(type, input, args,
                    [1, signature.toString('hex')])

                  return jayson.client.http(erisDb.TendermintUrl)
                    .request('broadcast_tx', [transaction])
                })
            })
          })
      })
    }
  }
}

/**
 * Create a new instance of the Accounts class.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @returns {Accounts} - A new instance of the Accounts class.
 */
exports.createInstance = function (client, unsafe, erisDb) {
  return new Accounts(client, unsafe, erisDb)
}

/**
 * Accounts is used to work with accounts and their related data.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @param {module:unsafe~Unsafe} unsafe - The unsafe object.
 * @augments module:util~UnsafeComponentBase
 * @constructor
 */
function Accounts (client, unsafe, erisDb) {
  util.UnsafeComponentBase.call(this, client, unsafe)
  this.erisDb = erisDb
}

nUtil.inherits(Accounts, util.UnsafeComponentBase)

/**
 * Get a list of accounts.
 * // TODO document
 * @param {module:util~FieldFilter|module:util~FieldFilter[]} [filter] - Filter the search.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Accounts.prototype.getAccounts = function (filter, callback) {
  var f, c
  if (typeof (filter) === 'function') {
    f = []
    c = filter
  } else if (!filter && typeof (callback) === 'function') {
    f = []
    c = callback
  } else {
    if (!(filter instanceof Array)) {
      f = [filter]
    } else {
      f = filter
    }
    c = callback
  }
  this._client.send(rpc.methodName('getAccounts'), rpc.accountsParam(f), c)
}

/**
 * Get the account with the given address.
 *
 * @param {string} address - The account address.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Accounts.prototype.getAccount = function (address, callback) {
  var accounts
  var account

  accounts = this

  if (!util.isAddress(address)) {
    callback(new Error('"' + address + '" is not a proper address string.'))
    return
  }
  this._client.send(rpc.methodName('getAccount'), rpc.addressParam(address),
    function (error, response) {
      if (error) {
        callback(error)
      } else {
        account = R.merge(response, createAccount(accounts.erisDb, address))
        callback(null, account)
      }
    })
}

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
  if (!util.isAddress(address)) {
    callback(new Error("'address' is not a proper address string."))
    return
  }
  this._client.send(rpc.methodName('getStorage'), rpc.addressParam(address), callback)
}

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
  if (!util.isAddress(address)) {
    callback(new Error("'address' is not a proper address string."))
    return
  }
  if (!util.isHex(key)) {
    callback(new Error("'key' is not a proper hex string."))
    return
  }
  this._client.send(rpc.methodName('getStorageAt'), rpc.storageAtParam(address, key), callback)
}

/**
 * Generate a new private account.
 *
 * Note: This is an unsafe method which requires a private key to be sent from the blockchain client.
 *
 * @param {*} context - context wildcard object used in validation.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Accounts.prototype.genPrivAccount = function (context, callback) {
  this._unsafe.genPrivAccount(context, callback)
}
