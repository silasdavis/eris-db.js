## erisdb-js

This library is a node.js wrapper for the [Thelonious](https://github.com/eris-ltd/thelonious) blockchain client.

**NOTE: Right now it uses tendermint directly, as it has not yet been fully integrated with GenDoug.**

### Installation and usage

TODO get the new npm name.


The main class is `ErisDb`. A standard `ErisDB` instance is created like this:

```
var edbFactory = require('erisdb');

var edb = edbFactory.createInstance("ws://localhost:1337/rpc");

thel.start(callback);

```

The parameters for `createInstance` is the server endpoint as a string, and whether or not to use websockets (false or no value means it will use the default, which is http).

### API Reference

TODO link to web-api pages and jsdoc

### Unit tests

Unit testing can be done by running `mocha` or `npm test` from the root dir.

### Documentation

Running `doc.sh` will generate standard documentation using `jsdoc` (currently `3.3.0beta`).
 
Running `devDoc.sh` will include more info, such as private fields and methods.

### Browser

This library will be possible to run from a web-browser. It is in the early stages.
