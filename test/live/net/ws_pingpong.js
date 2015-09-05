/* This file is for testing RPC methods.
 */

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

var serverServerURL = "http://localhost:1337/server";

var testData = require('./../../testdata/testdata.json');

var requestData = {
    priv_validator: testData.chain_data.priv_validator,
    genesis: testData.chain_data.genesis,
    max_duration: 10
};

var edb;

describe('ErisDbWebSocket', function () {

    before(function (done) {
        this.timeout(4000);

        edb = edbModule.createInstance("ws://localhost:1337/socketrpc", true);
        edb.start(function(err){
            if (err){
                throw err;
            }
            console.time("ws");
            done();
        });
    });

    after(function(){
        console.timeEnd("ws");
    });

    describe('#getState', function () {
        this.timeout(25000);
        it("should ping and maintain a connection", function (done) {
            setTimeout(checkNw, 21000);

            function checkNw(){
                edb.network().getClientVersion(function(error, data){
                    if(error){
                        console.log(error);
                        return;
                    }
                    console.log(data);
                    done();
                });
            }
        });
    });

});