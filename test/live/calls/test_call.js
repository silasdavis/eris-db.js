var fs = require('fs-extra');
var util = require('../../../lib/util');
var asrt = require('assert');
var edbModule = require("../../../index");

var edb;
var address;

var serverServerURL = "http://localhost:1337/server";

describe('TestCall', function () {

    before(function (done) {
        edb = edbModule.createInstance("http://localhost:1337/rpc");
        done();
        var contracts = fs.readJsonSync(__dirname + "/../../dbs/calls/contracts.json", {throws: true});
        address = contracts[0].address;
    });

    it("should call test.sol on chain and get the value from default", function (done) {
        edb.txs().call(address, "", function (error, data) {
            asrt.ifError(error);
            asrt.equal(data.return, "00000000000000000000000037236df251ab70022b1da351f08a20fb52443e37");
            done();
        });
    });

    it("should call test.sol on chain and add two numbers", function (done) {
        var sig = "a5f3c23b";
        var a = "0000000000000000000000000000000000000000000000000000000000000005";
        var b = "0000000000000000000000000000000000000000000000000000000000000092";
        var input = sig + a + b;
        edb.txs().call(address, input, function (error, data) {
            asrt.ifError(error);
            console.log(data);
            asrt.equal(data.return, "0000000000000000000000000000000000000000000000000000000000000097");
            done();
        });
    });
});