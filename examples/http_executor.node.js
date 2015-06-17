var edbModule = require("../index");

var serverURL = "http://localhost:1337";

exports.runHttp = function(runnable, data){
    var edb = edbModule.createInstance(serverURL + '/rpc');
    // Run the example with the given erisdb.
    runnable.run(edb, data, function(){
        process.exit(0);
    });
};