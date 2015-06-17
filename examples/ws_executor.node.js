var edbModule = require("../index");

var serverURL = "http://localhost:1337";

exports.runWs = function(runnable, data){
    var edb = edbModule.createInstance(serverURL + '/socketrpc', true);
    // Run the example with the given erisdb.
    edb.start(function (error, edb) {
        if (error) {
            throw new Error(error);
        }
        // Run the example with the given erisdb.
        runnable.run(edb, data, function(){
            process.exit(0);
        });
    });
};