# erisdb-js (Alpha)

This is a JavaScript API for communicating with a [ErisDB](https://github.com/eris-ltd/eris-db) server.

## Installation

```shell
$ npm install eris-db
```

## Usage

The library assumes you have the [Eris CLI](https://github.com/eris-ltd/eris-cli) installed locally.

```
var assert = require('assert')
var erisDb = require('eris-db')

db.open('blockchain', {user: 'CA8B5C96DF6305046DF8E1F998467577D7012A52'})
  .then(function (db) {
    db.blockchain().getChainId(function (error, response) {
      assert.ifError(error)
      assert.equal(response.chain_id, 'blockchain')
    })

    // Close the connection when finished.
    db.close()
  })
```

The first argument is the name of the chain (Eris DB server) you want to interact with.  The name of an existing chain can be seen via the command `eris chains ls`.

The second (optional) argument is a user account address for signing transactions.  You must provide this argument if you want to perform write operations on the chain.

## API Reference

### erisDB

#### erisDb.open (chainName[, options])

* `chainName` &lt;String> the name of the Eris DB server to connect to
* `options`: &lt;Object>
  * `user`: &lt;String> the address of the account with which to sign transactions

Opens a connection to the Eris DB server.  Returns a promise for a [`db`](#Connection) object.

### <a name="Connection">db</a>

#### db.close (callback)

It will invoke the zero-argument callback function when the socket has been terminated.

#### RPC methods

There are bindings for all the RPC methods. All functions are on the form `function(param1, param2, ... , callback)`, where the callback is a function on the form `function(error,data)` (it is documented under the name `methodCallback`). The `data` object is the same as you would get by calling the corresponding RPC method directly.

This is the over-all structure of the library. The `unsafe` flag means a private key is either sent or received, so should be used with care (dev only).

NOTE: There will be links to the proper jsdoc and integration with erisindustries.com. For now, the components point to the actual code files and methods points to the web-API method in question.

| Component Name | Accessor |
| :------------- | :------- |
| Accounts | [db.accounts()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/accounts.js) |
| Blockchain | [db.blockchain()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/blockchain.js) |
| Consensus | [db.consensus()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/consensus.js) |
| Events | [db.events()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/events.js) |
| NameReg | [db.namereg()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/namereg.js) |
| Network | [db.network()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/network.js) |
| Transactions | [db.txs()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/transactions.js) |

### Components

#### Accounts

The accounts object has methods for getting account and account-storage data.

##### Accounts.getAccount (address, callback)

* `address` &lt;String> the account address
* `callback` &lt;Function>

Returns an `Account` object with the following method and properties:

##### Account.setPermission (type, value)

* `type` &lt;String> must be `'call'`
* `value` &lt;Boolean>

Sets a permission on the account.

##### Account properties

```
{
    address:      <string>
    pub_key:      <PubKey>
    sequence:     <number>
    balance:      <number>
    code:         <string>
    storage_root: <string>
}
```

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Accounts.getAccounts | [db.getAccounts](https://github.com/eris-ltd/eris-db/blob/master/api.md#getaccounts) | |
| Accounts.getStorage | [db.getStorage](https://github.com/eris-ltd/eris-db/blob/master/api.md#getstorage) | |
| Accounts.getStorageAt | [db.getStorageAt](https://github.com/eris-ltd/eris-db/blob/master/api.md#getstorageat) | |
| Accounts.genPrivAccount | [db.genPrivAccount](https://github.com/eris-ltd/eris-db/blob/master/api.md#genprivaccount) | unsafe |

#### BlockChain

The accounts object has methods for getting blockchain-related data, such as a list of blocks, or individual blocks, or the hash of the genesis block.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| BlockChain.getInfo |  [db.getBlockchainInfo](https://github.com/eris-ltd/eris-db/blob/master/api.md#getblockchaininfo) | |
| BlockChain.getChainId | [db.getChainId](https://github.com/eris-ltd/eris-db/blob/master/api.md#getchainid) | |
| BlockChain.getGenesisHash | [db.getGenesisHash](https://github.com/eris-ltd/eris-db/blob/master/api.md#getgenesishash) | |
| BlockChain.getLatestBlockHeight | [db.getLatestBlockHeight](https://github.com/eris-ltd/eris-db/blob/master/api.md#getlatestblockheight) | |
| BlockChain.getLatestBlock | [db.getLatestBlock](https://github.com/eris-ltd/eris-db/blob/master/api.md#getlatestblock) | |
| BlockChain.getBlocks | [db.getBlocks](https://github.com/eris-ltd/eris-db/blob/master/api.md#getblocks) | |
| BlockChain.getBlock | [db.getBlock](https://github.com/eris-ltd/eris-db/blob/master/api.md#getblock) | |

#### Consensus

The consensus object has methods for getting consensus-related data.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Consensus.getState |   [db.getConsensusState](https://github.com/eris-ltd/eris-db/blob/master/api.md#getconsensusstate) | |
| Consensus.getValidators | [db.getValidators](https://github.com/eris-ltd/eris-db/blob/master/api.md#getvalidators) | |

#### Events

The tendermint client will generate and fire off events when important things happen, like when a new block has been committed, or someone is transacting to an account. It is possible to subscribe to these events. These are the methods for subscribing, un-subscribing and polling.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Events.subscribe | [db.eventSubscribe](https://github.com/eris-ltd/eris-db/blob/master/api.md#eventsubscribe) | |
| Events.unsubscribe | [db.eventUnsubscribe](https://github.com/eris-ltd/eris-db/blob/master/api.md#eventunubscribe) | |
| Events.poll | [db.eventPoll](https://github.com/eris-ltd/eris-db/blob/master/api.md#eventpoll) | |

##### Helpers

The helper functions makes it easier to manage subscriptions. Normally you'd be using these functions rather then managing the subscriptions yourself.

Helper functions always contain two callback functions - a `createCallback(error, data)` and an `eventCallback(error, data)`.

The `createCallback` data is an [EventSub]() object, that can be used to do things like getting the event ID, the subscriber ID, and to stop the subscription.

The `eventCallback` data is the event object. This object is different depending on the event type. In the case of `NewBlock` it will be a block, the consensus events is a transaction object, etc. More info can be found in the [api doc]().

| Method | Arguments |
| :----- | :-------- |
| Events.subAccountInput | `account address <string>` |
| Events.subAccountOutput | `account address <string>` |
| Events.subAccountReceive | `account address <string>` |
| Events.subLogEvent | `account address <string>` |
| Events.subSolidityEvent | `account address <string>` |
| Events.subNewBlocks | `-` |
| Events.subForks | `-` |
| Events.subBonds | `-` |
| Events.subUnbonds | `-` |
| Events.subRebonds | `-` |
| Events.subDupeouts | `-` |

`subSolidityEvent` and `subLogEvent` are two different names for the same type of subscription (log events).

#### NameReg

The NameReg object has methods for accessing the name registry.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| NameReg.getEntry | [db.getNameRegEntry](https://github.com/eris-ltd/eris-db/blob/master/api.md#get-namereg-entry) | |
| NameReg.getEntries | [db.getNameRegEntries](https://github.com/eris-ltd/eris-db/blob/master/api.md#get-namereg-entries) | |

#### Network

The accounts object has methods for getting network-related data, such as a list of all peers. It could also have been named "node".

Client Version may be a bit misplaced

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Network.getInfo | [db.getNetworkInfo](https://github.com/eris-ltd/eris-db/blob/master/api.md#getnetworkinfo) |  |
| Network.getClientVersion | [db.getClientVersion](https://github.com/eris-ltd/eris-db/blob/master/api.md#getclientversion) | |
| Network.getMoniker | [db.getMoniker](https://github.com/eris-ltd/eris-db/blob/master/api.md#getmoniker) | |
| Network.isListening | [db.isListening](https://github.com/eris-ltd/eris-db/blob/master/api.md#islistening) | |
| Network.getListeners | [db.getListeners](https://github.com/eris-ltd/eris-db/blob/master/api.md#getlisteners) | |
| Network.getPeers | [db.getPeers](https://github.com/eris-ltd/eris-db/blob/master/api.md#getpeers) | |
| Network.getPeer | [db.getPeer](https://github.com/eris-ltd/eris-db/blob/master/api.md#getpeer) | |

#### Transactions

A transaction is the equivalence of a database `write` operation. They can be done in two ways. There's the "dev" way, which is to call `transact` and pass along the target address (if any), data, gas, and a private key used for signing. It is very similar to the old Ethereum way of transacting, except Tendermint does not keep accounts in the client, so a private key needs to be sent along. This means the server **should either run on the same machine as the tendermint client, or in the same, private network**.

Transacting via `broadcastTx` will be the standard way of doing things if you want the key to remain on the users machine. This requires a browser plugin for doing the actual signing, which we will add later. For now, you should stick to the `transact` method.

To get a private key for testing/developing, you can run `tendermint gen_account` if you have it installed. You can also run `tools/pa_generator.js` if you have a local node running. It will take the url as command line argument at some point...

##### Calls

Calls provide read-only access to the smart contracts. It is used mostly to get data out of a contract-accounts storage by using the contracts accessor methods, but can be used to call any method that does not change any data in any account. A trivial example would be a contract function that takes two numbers as input, adds them, and then simply returns the sum.

There are two types of calls. `Call` takes a data string and an account address and calls the code in that account (if any) using the provided data as input. This is the standard method for read-only operations.

`CallCode` works the same except you don't provide an account address but the actual compiled code instead. It's a dev tool for accessing the VM directly. "Code-execution as a service".

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Transactions.broadcastTx | [db.broadcastTx](https://github.com/eris-ltd/eris-db/blob/master/api.md#broadcasttx) | see below |
| Transactions.getUnconfirmedTxs | [db.getUnconfirmedTxs](https://github.com/eris-ltd/eris-db/blob/master/api.md#getunconfirmedtxs) | |
| Transactions.call | [db.call](https://github.com/eris-ltd/eris-db/blob/master/api.md#call) | |
| Transactions.callCode | [db.callCode](https://github.com/eris-ltd/eris-db/blob/master/api.md#callcode) | |
| Transactions.transact | [db.transact](https://github.com/eris-ltd/eris-db/blob/master/api.md#transact) | unsafe |
| Transactions.transactAndHold | [db.transactAndHold](https://github.com/eris-ltd/eris-db/blob/master/api.md#transact-and-hold) | unsafe |
| Transactions.transactNameReg | [db.transactNameReg](https://github.com/eris-ltd/eris-db/blob/master/api.md#transactnamereg) | unsafe |

`broadcastTx` is useless until we add a client-side signing solution.

## Documentation

Generate documentation using the command `npm run doc`.

## Copyright

Copyright 2015 Eris Industries

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
