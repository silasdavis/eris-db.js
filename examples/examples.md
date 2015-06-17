# Examples

These examples show how to use the bare-bones eris-db javascript bindings to do transactions and subscribing to events and other things. Those who wishes to work with eris from javascript would normally not do this, but use the dapp creation utilities (due June/July 2015 that includes things like web3-style js contract objects, compiler js bindings, and a solidity contract unit testing library.

Examples generally uses the erisdb server-server, so as to produce the same results no matter where they are run. This means a server-server (erisdbss) is running, and it uses `util.getNewErisServer` to get a fresh node. If you just want to call a normal running erisdb server, or want to reconfigure the nodes yourself before starting, just use the normal factory method and pass in the URL. 

Runnable examples are on the following format: `name.[ss.]conn.[node.]js`. 
 
* `name` is the name of the example.
* `ss` means the example uses the server-server.
* `conn` can be either http or ws (websocket), which is just the way it talks to the server.
* `node` is for examples that will run only in node.js

There is also a base example used regardless of setup, which is on the form: `name.js`

### Executors and runnables

Each test is a runnable, which means they have a run function that takes an erisdb instance and the required data as parameters. To run the tests, the runnable will prepare data for the test and then pass the base test to the executor for the given type. As an example, if we are doing the `get_blocks` example using a http connection and the node is deployed using a server-server, we will run the file: `get_blocks/network_info.http.node.js`, which will take the `network_info.js` singleton and pass it to the `http_executor.ss.node.js`, which will then run it.

The node.js examples might accept arguments later, so as to avoid making so many files.

### List of examples

TODO add more.

* `tx/tx_and_check` - Creates a new contract by transacting, waits for a block to be committed and then reads the storage of the contract account to conclude that data was written.
* `tx/tx_and_check` - Gets a bunch of blocks and prints them.


### Advice

Another place to find example code is in the tests folder.