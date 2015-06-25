var util = require("../../../lib/util");
var edbModule = require("../../../index");

var serverServerURL = "http://localhost:1337/server";

var test_data = require('../../testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 40
};

var edb;

var privKey = test_data.chain_data.priv_validator.priv_key[1];
var compiled = "60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b60d38061003f6000396000f30060606040523615603a576000357c010000000000000000000000000000000000000000000000000000000090048063a5f3c23b14609757603a565b606b5b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506068565b90565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60ac60048035906020018035906020015060c2565b6040518082815260200191505060405180910390f35b6000818301905060cd565b9291505056";

// Run the example with the given erisdb and private key.
(function () {
    util.getNewErisServer(serverServerURL, requestData, function (error, port) {
        edb = edbModule.createInstance("http://localhost:" + port + '/rpc');
    });

    function transact(privKey, code, callback) {
        edb.txs().transact(privKey, "", code, 1000000, 0, null, function (error, data) {
                if (error) {
                    throw new Error(error);
                }
                console.log(data);
                waitForTx(data.contract_addr);
            }
        );
    }

    // Basically wait for the next block to be committed.
    function waitForTx(address){
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
                throw new Error(error);
            }
            if (data) {
                eventSub.stop(function () {
                });
                console.log(data);
                call(address);
            }
        });
    }

    function call(address, input) {
        edb.txs().call(address, input, function (error, data) {
            if (error) {
                throw new Error(error);
            }
            console.log(data);
        })
    }

})();