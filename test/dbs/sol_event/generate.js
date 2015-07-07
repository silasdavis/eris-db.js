var fs = require('fs-extra');
var util = require("../../../lib/util");
var edbModule = require("../../../index");

var serverServerURL = "http://localhost:1337/server";

var test_data = require('../../testdata/testdata.json');

var validator = require('./dbfolder/priv_validator.json');

var edb;

var privKey = validator.priv_key[1];
var compiled;

// Run the example with the given erisdb and private key.
(function () {
    edb = edbModule.createInstance("http://localhost:1337/rpc");
    compiled = fs.readFileSync("./Test.binary").toString();
    console.log(compiled);
    transact(privKey, compiled, function(error, data){
        if(error){
            throw error;
        }
        process.exit(0);
    });

    function transact(privKey, code, callback) {
        edb.txs().transact(privKey, "", code, 1000000, 0, null, function (error, data) {
                if (error) {
                    throw new Error(error);
                }
                var contracts = [{
                    name: "test.sol",
                    address: data.contract_addr
                }];
                fs.writeJsonFileSync("./contracts.json", contracts);
                waitForTx(callback);
            }
        );
    }

    // Basically wait for the next block to be committed.
    function waitForTx(callback){
        var eventSub;
        edb.events().subNewBlocks(function (error, data) {
            if (error) {
                throw new Error(error);
            }
            eventSub = data;
            setTimeout(function () {
                data.stop(function () {
                    throw new Error("No data came in.");
                })
            }, 20000);

        }, function (error, data) {
            if (error) {
                callback(error);
            }
            if (data) {
                eventSub.stop(function () {
                    console.log(data);
                    callback(null, data);
                });
            }
        });
    }

})();