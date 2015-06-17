var util = require('../lib/util');
var edbModule = require("../index");
var chainData = require('./chain_data');

/************************************************************************************************/
// This section is when using server-server to set up a fresh node each time, with the chain setup
// given by the test data.
var serverServerURL = "http://localhost:1337/server";

var requestData = {
    // What private validator to use.
    priv_validator: chainData.priv_validator,
    // What genesis.json file to use.
    genesis: chainData.genesis,
    // 10 seconds will be enough. 0 means run forever.
    max_duration: 20
};

exports.runHttp = function(runnable, data){
    // If you have a server already running, you'd just create a new instance of erisdb and
    // pass its url in. You would have to make sure accounts are properly set up though, so that
    // the key you use when transacting corresponds to an existing account.
    util.getNewErisServer(serverServerURL, requestData, function(err, URL){
        if(err){
            throw new Error(err);
        }
        console.log("");
        console.log("Got a new erisdb. Serving address: " + URL);
        console.log("");
        var edb = edbModule.createInstance(URL + '/rpc');
        // Run the example with the given erisdb.
        runnable.run(edb, data, function(){
            process.exit(0);
        });
    });
};