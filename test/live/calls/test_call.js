var fs = require('fs-extra');
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

var edb;
var input = "";
var address;

var serverServerURL = "http://localhost:1337/server";

describe('HttpCreateAndCall', function () {

    before(function (done) {
        edb = edbModule.createInstance("http://localhost:1337/rpc");
        done();
        var contracts = fs.readJsonSync("../../dbs/calls/contracts.json", {throws: true});
        address = contracts[0].address;
    });

    it("should call an existing contract and", function (done) {
        call(address, input, function(error, data){
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
            callback(error);
        }
        if (data) {
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