var fs = require('fs-extra');
var util = require('../../../lib/util');
var asrt = require('assert');
var edbModule = require("../../../index");

var edb;
var address;
var eventSub;

var serverServerURL = "http://localhost:1337/server";

describe('TestCall', function () {

    before(function (done) {
        edb = edbModule.createInstance("http://localhost:1337/rpc");
        done();
        var contracts = fs.readJsonSync(__dirname + "/../../dbs/sol_event/contracts.json", {throws: true});
        address = contracts[0].address;
    });

    it("should call test.sol on chain and get the value from default", function (done) {
        edb.txs().call(address, "", function (error, data) {
            asrt.ifError(error);
            asrt.equal(data.return, "00000000000000000000000037236df251ab70022b1da351f08a20fb52443e37");
            done();
        });
    });

    it("should call anonymous function in test.sol on chain and receive a solidity event", function (done) {
        edb.events().subSolidityEvent(address, function(error, data){
            if (error) {
                throw new Error(error);
            }
            eventSub = data;
            setTimeout(function () {
                data.stop(function () {
                    throw new Error("No data came in.");
                })
            }, 20000);
        }, function(error, event){
            asrt.ifError(error);
            console.log(event);
            console.log("Timestamp: ");
            var unixTS = parseInt(event.topics[1], 16);
            console.log(new Date(unixTS*1000).toString());
            asrt.equal(event.address.slice(24), address);
            asrt.equal(event.topics[0], "8B7CB35F3695C997E9144872475911E0B0E3827DC8210662CE77B82C4CE423D4");
            done();
        });
        edb.txs().call(address, "", function (error, data) {
        });
    });


});