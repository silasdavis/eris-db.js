var util = require('../lib/util');
var asrt;
var edbModule;
var localServ;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    localServ = require("./server_local/server");
    edbModule = require("../index");
} else {
    asrt = assert;
    edbModule = edbFact;
}

var serverServerURL = "http://localhost:1337/server";

var privValidator = {
    "address": "37236DF251AB70022B1DA351F08A20FB52443E37",
    "pub_key": [1, "CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906"],
    "priv_key": [1, "6B72D45EB65F619F11CE580C8CAED9E0BADC774E9C9C334687A65DCBAD2C4151CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906"],
    "last_height": 0,
    "last_round": 0,
    "last_step": 0
};

var genesis = {
    "chain_id": "my_event_tests",
    "accounts": [
        {
            "address": "F81CB9ED0A868BD961C4F5BBC0E39B763B89FCB6",
            "amount": 690000000000
        },
        {
            "address": "0000000000000000000000000000000000000002",
            "amount": 565000000000
        },
        {
            "address": "9E54C9ECA9A3FD5D4496696818DA17A9E17F69DA",
            "amount": 525000000000
        },
        {
            "address": "0000000000000000000000000000000000000004",
            "amount": 110000000000
        },
        {
            "address": "37236DF251AB70022B1DA351F08A20FB52443E37",
            "amount": 110000000000
        }

    ],
    "validators": [
        {
            "pub_key": [1, "CB3688B7561D488A2A4834E1AEE9398BEF94844D8BDBBCA980C11E3654A45906"],
            "amount": 5000000000,
            "unbond_to": [
                {
                    "address": "93E243AC8A01F723DE353A4FA1ED911529CCB6E5",
                    "amount": 5000000000
                }
            ]
        }
    ]
};

var params = {
    account: privValidator.address,
    privKey: privValidator.priv_key[1],
    storageKey: "",
    minHeight: 0,
    maxHeight: 1,
    height: 44,
    txData: "",
    txCode: "5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6102828061003b6000396000f3006000357c01000000000000000000000000000000000000000000000000000000009004806337f428411461004557806340c10f191461005a578063d0679d341461006e57005b610050600435610244565b8060005260206000f35b610068600435602435610082565b60006000f35b61007c600435602435610123565b60006000f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156100dd576100e2565b61011f565b80600160005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055505b5050565b80600160005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541061015e57610163565b610240565b80600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555080600160005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f93eb3c629eb575edaf0252e4f9fc0c5ccada50496f8c1d32f0f93a65a8257eb560003373ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020016000a15b5050565b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905061027d565b91905056",
    txGasLimit: 0,
    txFee: 0
};

var edb;
var eventSub;

describe('TheloniousHttp', function () {

    // In the node version we can start a tendermint server server automatically.
    // TODO clean this up.
    before(function (done) {
        this.timeout(5000);
        var httpClient = require('../lib/rpc/http').createInstance(serverServerURL);
        var msg = JSON.stringify({
            priv_validator: privValidator,
            genesis: genesis,
            max_duration: 30
        });
        httpClient.sendMsg(msg, "POST", function (err, data) {
            if (!err) {
                var URL;
                try {
                    var ret = JSON.parse(data);
                    URL = ret.URL;
                } catch (err) {
                    done();
                }
                edb = edbModule.createInstance(URL);
                done();
            } else {
                console.log("ERROR FROM SERVER");
                console.log(err);
                done();
            }
        });
    });

    describe('.events', function () {

        describe('#subNewBlock', function () {
            it("should subscribe to new block events", function (done) {
                this.timeout(25000);
                console.log("This should take about 15 seconds.");
                edb.events().subNewBlocks(function (err, data) {
                    asrt.ifError(err, "Blaaa, error.");
                    eventSub = data;
                    setTimeout(function () {
                        data.stop(function () {
                            throw new Error("No data came in.");
                        })
                    }, 20000);

                }, function(err, data){
                    if(data){
                        eventSub.stop(function(){});
                        done();
                    }
                });
            });
        });

    });
});