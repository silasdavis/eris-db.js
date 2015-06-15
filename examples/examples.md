# Examples

These examples show how to use the bare-bones eris-db javascript bindings to do transactions and subscribing to events and other things. Those who wishes to work with eris from javascript would normally not do this, but use the dapp creation utilities (due June/July 2015 that includes things like web3-style js contract objects, compiler js bindings, and a solidity contract unit testing library.

Examples generally uses the erisdb server-server, so as to produce the same results no matter where they are run. This means a server-server (erisdbss) is running, and it uses `util.getNewErisServer` to get a fresh node. If you just want to call a normal running erisdb server, or want to reconfigure the nodes yourself before starting, just use the normal factory method and pass in the URL. 

Runnable examples are on the following format: `name.[ss.]conn.[node.]js`. 
 
* `name` is the name of the example.
* `ss` means the example uses the server-server.
* `conn` can be either http or ws (websocket), which is just the way it talk to the server.
* `node` is for examples that will run only in node.js

They may have a base example used regardless of setup, which is on the form: `name.js`

### List of examples

TODO add more.

* `tx/tx_and_check` - Creates a new contract by transacting, waits for a block to be committed and then reads the storage of the contract account to conclude that data was written.


### Advice

Another place to find example code is in the tests folder.