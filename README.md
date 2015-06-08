## thelonious-js

This library is a node.js wrapper for the [Thelonious](https://github.com/eris-ltd/thelonious) blockchain client.

**NOTE: Right now it uses tendermint directly, as it has not yet been fully integrated with GenDoug and all that.**

### Installation and usage

You can use npm to get the library.

`npm install thelonious`

The main class is `Thelonious`. A standard `Thelonious` instance is created like this:

```
var thelFactory = require('thelonious');

var thel = thelFactory.createInstance("ws://localhost:1337/socketrpc", true);

thel.start(callback);

```

The parameters for `createInstance` is the server endpoint as a string, and whether or not to use websockets (false or no value means it will use http).

### API Reference

Thelonious has a number of different components. Specifics about each method can be found in the documentation.

####Accounts

`Accounts` has methods for working with tendermint accounts (contract or regular ones)

- `getAccounts(callback)` - Gets a list of all accounts.
- `getAccount(address, callback)` - Gets a list of all accounts.
- `getStorage(address, callback)` - Gets a list of all accounts.
- `getStorageAt(address, key, callback)` - Gets a list of all accounts.

####Blockchain

`Blockchain` - Has methods for working with the blockchain, such as getting the latest block height, or a sequence of blocks.
- `getAccounts(callback)` - Gets a list of all accounts.

All functions requires a callback. The callbacks always has the signature `callback(error, data)`.

TODO Link to online docs.

### Unit tests

Unit testing can be done by running `mocha` or `npm test` from the root dir.

### Documentation

Running `doc.sh` will generate standard documentation using `jsdoc` (currently `3.3.0beta`).
 
Running `devDoc.sh` will include more info, such as private fields and methods.

### Browser

This library will be possible to run from a web-browser. It is in the early stages. It works, but is currently un-organized and is only tested on latest chrome. The bundle is available as /dist/thelonious.js. It will export a "thelFactory" object that works the same as `var thelFactory = require('thelonious')`. Test files for browser http and websocket can be found in `/test/browser`. They run tests against a thelonious-tendermint RPC server.
 
### TODO

- Replace those shell scripts with proper gulp tasks.
- Improve browser support.
- Get the mock test data done and integrate in test across the stack (including mock server here).