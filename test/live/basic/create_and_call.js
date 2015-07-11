var util = require('../../../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    edbModule = require("../../../index");
} else {
    asrt = assert;
    edbModule = edbFactory;
}

var test_data = require('./../../testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 40
};

var edb;

var privKey = test_data.chain_data.priv_validator.priv_key[1];
var compiled = "60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b60d38061003f6000396000f30060606040523615603a576000357c010000000000000000000000000000000000000000000000000000000090048063a5f3c23b14609757603a565b606b5b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506068565b90565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60ac60048035906020018035906020015060c2565b6040518082815260200191505060405180910390f35b6000818301905060cd565b9291505056";
var input = "";
var address;

var serverServerURL = "http://localhost:1337/server";

describe('HttpCreateAndCall', function () {

    // Not ideal, we just deploy the contract and go.
    before(function (done) {
        this.timeout(20000);
        util.getNewErisServer(serverServerURL, requestData, function (error, port) {
            edb = edbModule.createInstance("http://localhost:" + port + '/rpc');
            transact(privKey, compiled, function (error, data) {
                done();
            });
        });
    });

    it("should subscribe to new block events", function (done) {
        call(address, input, function (error, data) {
            if (error) {
                callback(error);
            }
            asrt.equal(data.return, "00000000000000000000000037236df251ab70022b1da351f08a20fb52443e37");
            done();
        });
    });

});

function transact(privKey, code, callback) {
    edb.txs().transact(privKey, "", code, 1000000, 0, null, function (error, data) {
            if (error) {
                callback(error);
            }
            address = data.contract_addr;
            waitForTx(callback);
        }
    );
}

// Basically wait for the next block to be committed.
function waitForTx(callback) {
    var eventSub;
    edb.events().subNewBlocks(function (error, data) {
        if (error) {
            console.log("Newblocks start error");
            console.log(error);
            callback(error);
        }
        eventSub = data;
        setTimeout(function () {
            data.stop(function () {
                throw new Error("No data came in.");
            })
        }, 20000);
        console.log("Waiting for block (usually takes about 13-14 seconds.");

    }, function (error, data) {
        if (error) {
            console.log(error);
            callback(error);
        } else {
            eventSub.stop(function () {
            });
            callback(null, data);
        }
    });
}

function call(address, input, callback) {
    edb.txs().call(address, input, function (error, data) {
        if (error) {
            callback(error);
        }
        callback(null, data);
    });
}