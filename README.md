# erisdb-js

`erisdb-js` is a javascript API for [erisdb-tendermint](https://github.com/eris-ltd/eris-db).

## Installation and usage

`npm install eris-db`

The main class is `ErisDb`. A standard `ErisDB` instance is created like this:

```
var edbFactory = require('eris-db');

var edb = edbFactory.createInstance("http://localhost:1337/rpc");

edb.start(callback);

```

The parameters for `createInstance` is the server URL as a string, and whether or not to use websockets (false or no value means it will use http).

No config file is needed for this library.

## API Reference

There are bindings for all the RPC methods. All functions are on the form `function(param1, param2, ... , callback)`, where the callback is a function on the form `function(error,data)` (it is documented under the name `methodCallback`). The `data` object is the same as you would get by calling the corresponding RPC method directly. 

This is the over-all structure of the library. The `unsafe` flag means a private key is either sent or received, so should be used with care (dev only). 

NOTE: There will be links to the proper jsdoc once we get those up on the eris docs page!

### ErisDB   

| Component Name | Accessor |
| :------------- | :------- |
| Accounts | [ErisDB.accounts()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/accounts.js) |
| Blockchain | [ErisDB.blockchain()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/blockchain.js) |
| Consensus | [ErisDB.consensus()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/consensus.js) |
| Events | [ErisDB.events()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/events.js) |
| Network | [ErisDB.network()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/network.js) |
| Transactions | [ErisDB.txs()](https://github.com/eris-ltd/erisdb-js/blob/master/lib/transactions.js) |

### Components

#### Accounts 

The accounts object has methods for getting account and account-storage data.

| Method | RPC method | Notes |
| :----- | :--------- | :---- | 
| Accounts.getAccounts | [erisdb.getAccounts](https://github.com/eris-ltd/eris-db/blob/master/api.md#getaccounts) | | 
| Accounts.getAccount | [erisdb.getAccount](https://github.com/eris-ltd/eris-db/blob/master/api.md#getaccount) | | 
| Accounts.getStorage | [erisdb.getStorage](https://github.com/eris-ltd/eris-db/blob/master/api.md#getstorage) | | 
| Accounts.getStorageAt | [erisdb.getStorageAt](https://github.com/eris-ltd/eris-db/blob/master/api.md#getstorageat) | | 
| Accounts.genPrivAccount | [erisdb.genPrivAccount](https://github.com/eris-ltd/eris-db/blob/master/api.md#genprivaccount) | unsafe |

#### BlockChain

The accounts object has methods for getting blockchain-related data, such as a list of blocks, or individual blocks, or the hash of the genesis block.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| BlockChain.getInfo |  [erisdb.getBlockchainInfo](https://github.com/eris-ltd/eris-db/blob/master/api.md#getblockchaininfo) | |
| BlockChain.getChainId | [erisdb.getChainId](https://github.com/eris-ltd/eris-db/blob/master/api.md#getchainid) | |
| BlockChain.getGenesisHash | [erisdb.getGenesisHash](https://github.com/eris-ltd/eris-db/blob/master/api.md#getgenesishash) | |
| BlockChain.getLatestBlockHeight | [erisdb.getLatestBlockHeight](https://github.com/eris-ltd/eris-db/blob/master/api.md#getlatestblockheight) | |
| BlockChain.getLatestBlock | [erisdb.getLatestBlock](https://github.com/eris-ltd/eris-db/blob/master/api.md#getlatestblock) | |
| BlockChain.getBlocks | [erisdb.getBlocks](https://github.com/eris-ltd/eris-db/blob/master/api.md#getblocks) | |
| BlockChain.getBlock | [erisdb.getBlock](https://github.com/eris-ltd/eris-db/blob/master/api.md#getblock) | |

#### Consensus

The consensus object has methods for getting consensus-related data.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Consensus.getState |   [erisdb.getConsensusState](https://github.com/eris-ltd/eris-db/blob/master/api.md#getconsensusstate) | |
| Consensus.getValidators | [erisdb.getValidators](https://github.com/eris-ltd/eris-db/blob/master/api.md#getvalidators) | |

#### Events

The tendermint client will generate and fire off events when important things happen, like when a new block has been committed, or someone is transacting to an account. It is possible to subscribe to these events. These are the methods for subscribing, un-subscribing and polling.


| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Events.subscribe | [erisdb.eventSubscribe](https://github.com/eris-ltd/eris-db/blob/master/api.md#eventsubscribe) | |
| Events.unsubscribe | [erisdb.eventUnsubscribe](https://github.com/eris-ltd/eris-db/blob/master/api.md#eventunubscribe) | |
| Events.poll | [erisdb.eventPoll](https://github.com/eris-ltd/eris-db/blob/master/api.md#eventpoll) | |

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
| Events.subNewBlocks | `-` |
| Events.subForks | `-` |
| Events.subBonds | `-` |
| Events.subUnbonds | `-` |
| Events.subRebonds | `-` |
| Events.subDupeouts | `-` |

#### Network

The accounts object has methods for getting network-related data, such as a list of all peers. It could also have been named "node".

Client Version may be a bit misplaced

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Network.getInfo | [erisdb.getNetworkInfo](https://github.com/eris-ltd/eris-db/blob/master/api.md#getnetworkinfo) |  |
| Network.getClientVersion | [erisdb.getClientVersion](https://github.com/eris-ltd/eris-db/blob/master/api.md#getclientversion) | |
| Network.getMoniker | [erisdb.getMoniker](https://github.com/eris-ltd/eris-db/blob/master/api.md#getmoniker) | |
| Network.isListening | [erisdb.isListening](https://github.com/eris-ltd/eris-db/blob/master/api.md#islistening) | |
| Network.getListeners | [erisdb.getListeners](https://github.com/eris-ltd/eris-db/blob/master/api.md#getlisteners) | |
| Network.getPeers | [erisdb.getPeers](https://github.com/eris-ltd/eris-db/blob/master/api.md#getpeers) | |
| Network.getPeer | [erisdb.getPeer](https://github.com/eris-ltd/eris-db/blob/master/api.md#getpeer) | |

#### Transactions

A transaction is the equivalence of a database `write` operation. They can be done in two ways. There's the "dev" way, which is to call `transact` and pass along the target address (if any), data, gas, and a private key used for signing. It is very similar to the old Ethereum way of transacting. The other way is to create a transaction object and passing it to the `broadcastTx` method.

Transacting via `broadcastTx` will be the standard way of doing things if you want the key to remain on the users machine. This requires a browser plugin for doing the actual signing, which we will add later. For now, you should stick to the `transact` method. 

To get a private key for testing/developing, you can run `tendermint gen_account` if you have it installed. You can also run `tools/pa_generator.js` if you have a local node running. It will take the url as command line argument at some point...

##### Calls

Calls are used to call code, and can not be used to modify the state of the database. It is essentially a database `read`. It is used mostly to get data out of a contract-accounts storage by using the contracts accessor methods, but can be used to call any method that does not use persistent storage in any way. A trivial example would be a contract function that takes two numbers as input, adds them, and returns the sum. 

There are two types of calls. `Call` takes a data string and an account address and calls the code in that account (if any) using the provided data as input. `CallCode` works the same except you don't provide an account address but the actual compiled code instead. It's basically just exposes the VM functionality of the node. "Code-execution as a service". 

Again - neither of the call functions will affect the state of the database/chain in any way.

| Method | RPC method | Notes |
| :----- | :--------- | :---- |
| Transactions.broadcastTx | [erisdb.broadcastTx](https://github.com/eris-ltd/eris-db/blob/master/api.md#broadcasttx) | |
| Transactions.getUnconfirmedTxs | [erisdb.getUnconfirmedTxs](https://github.com/eris-ltd/eris-db/blob/master/api.md#getunconfirmedtxs) | |
| Transactions.call | [erisdb.call](https://github.com/eris-ltd/eris-db/blob/master/api.md#call) | |
| Transactions.callCode | [erisdb.callCode](https://github.com/eris-ltd/eris-db/blob/master/api.md#callcode) | |
| Transactions.signTx | [erisdb.signTx](https://github.com/eris-ltd/eris-db/blob/master/api.md#signtx) | unsafe |
| Transactions.transact | [erisdb.transact](https://github.com/eris-ltd/eris-db/blob/master/api.md#transact) | unsafe |

## Tests

Tests are done using `mocha`. At this point, there is only integration tests. These will be moved into a separate repo and replaced with other tests before 1.0. To run the tests you need to have an erisdb server-server running.

To run the integration tests, start a [eris-db](https://github.com/eris-ltd/eris-db) server-server (instructions are in the README file), cd into the root of this library and run `$ mocha`. The tests takes about 30 seconds.

## Documentation

Docs can be generated by using the scripts `doc.sh` or `devDoc.sh`; the latter includes private fields and functions.

## Browser

This library will be possible to run from a web-browser.
