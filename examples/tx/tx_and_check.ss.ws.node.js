var base = require('./tx_and_check');
var util = require('../../lib/util');
var edbModule = require("../../index");
var chainData = require('../chain_data');

var serverServerURL = "http://localhost:1337/server";

var requestData = {
    // What private validator to use.
    priv_validator: chainData.priv_validator,
    // What genesis.json file to use.
    genesis: chainData.genesis,
    // 10 seconds will be enough. 0 means run forever.
    max_duration: 50
};

// If you have a server already running, you'd just create a new instance of erisdb and
// pass its url in. You would have to make sure accounts are properly set up though, so that
// the key you use when transacting corresponds to an existing account.
util.getNewErisServer(serverServerURL, requestData, function (err, URL) {
    if (err) {
        throw new Error(err);
    }
    console.log("");
    console.log("Got a new erisdb. Serving address: " + URL);
    console.log("");
    var edb = edbModule.createInstance(URL + '/socketrpc', true);
    edb.start(function (error, edb) {
        if (error) {
            throw new Error(error);
        }
        // Run the example with the given erisdb.
        base.run(edb, requestData.priv_validator.priv_key[1]);
    });
});