var util = require('../lib/util');
var asrt;
var thelModule;
var localServ;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    localServ = require("./server_local/server");
    thelModule = require("../index");
} else {
    asrt = assert;
    thelModule = thelFact;
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
    "chain_id": "my_tests",
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

var thel;


var caddr = "9FC1ECFCAE2A554D4D1A000D0D80F748E66359E3";

describe('TheloniousHttp', function () {

    // In the node version we can start a tendermint server server automatically.
    // TODO clean this up.
    before(function (done) {
        this.timeout(4000);
        var httpClient = require('../lib/rpc/http').createInstance(serverServerURL);
        console.log("Created HTTP Client");

        var msg = JSON.stringify({
            priv_validator: privValidator,
            genesis: genesis,
            max_duration: 10
        });
        httpClient.sendMsg(msg, "POST", function (err, data) {
            if (!err) {
                console.log("SERVER RETURN DATA: " + data);
                var URL;
                try {
                    var ret = JSON.parse(data);
                    URL = ret.URL;
                } catch (err) {
                    done();
                }
                thel = thelModule.createInstance(URL);
                setTimeout(done, 3000);
            } else {
                console.log("ERROR FROM SERVER");
                console.log(err);
                done();
            }
        });
    });

    /*
     describe('.events', function () {

     describe('#subAccountOutput', function () {
     it("should subscribe to output from the given account", function (done) {
     this.timeout(30000);
     thel.events().subAccountOutput(params.account, function(err, data){

     thel.txs().transact(params.privKey, "", params.txCode,
     params.txGasLimit, params.txFee, ret(checkTransactCC, function(){}));
     thel.txs().transact(params.privKey, "", params.txCode,
     params.txGasLimit, params.txFee, ret(checkTransactCC, function(){}));
     thel.txs().transact(params.privKey, "", params.txCode,
     params.txGasLimit, params.txFee, ret(checkTransactCC, function(){}));

     setTimeout(function(){data.stop(function(){
     done();
     })}, 25000);

     }, ret(checkAccountOutputEvent, done));
     });
     });

     });
     */

    describe('.consensus', function () {

        describe('#getState', function () {
            it("should get the consensus state", function (done) {
                thel.consensus().getState(ret(checkConsensusState, done));
            });
        });

        describe('#getValidators', function () {
            it("should get the validators", function (done) {
                thel.consensus().getValidators(ret(checkValidators, done));
            });
        });

    });

    describe('.network', function () {

        describe('#getInfo', function () {
            it("should get the network info", function (done) {
                thel.network().getInfo(ret(checkNetworkInfo, done));
            });
        });

        describe('#getMoniker', function () {
            it("should get the moniker", function (done) {
                thel.network().getMoniker(ret(checkMoniker, done));
            });
        });

        describe('#isListening', function () {
            it("should get the listening value", function (done) {
                thel.network().isListening(ret(checkListening, done));
            });
        });

        describe('#getPeers', function () {
            it("should get the peers", function (done) {
                thel.network().getPeers(ret(checkPeers, done));
            });
        });

    });

    describe('.txs', function () {

        /*
         describe('#broadcastTx', function () {
         it("should broadcast a tx", function (done) {
         thel.txs().broadcastTx(params.tx, ret(checkBroadcastTx, done));
         });
         });
         */


        describe('#transact contract create', function () {
            it("should send a contract create tx to an address", function (done) {
                thel.txs().transact(params.privKey, "", params.txCode,
                    params.txGasLimit, params.txFee, ret(checkTransactCC, done));
            });
        });

        describe('#transact', function () {
            it("should transact with the account at the given address", function (done) {
                thel.txs().transact(params.privKey, caddr,
                    params.txData, params.txGasLimit, params.txFee,
                    ret(checkTransact, done));
            });
        });

        describe('#getUnconfirmedTxs', function () {
            it("should get the unconfirmed txs", function (done) {
                thel.txs().getUnconfirmedTxs(ret(checkUnconfirmedTxs, done));
            });
        });

        /*
        describe('#call', function () {
            it("should call the given address using the given data", function (done) {
                thel.txs().call(caddr, params.txData, ret(checkCall, done));
            });
        });
        */

        describe('#callCode', function () {
            it("should callCode with the given code and data", function (done) {
                thel.txs().callCode(params.txCode, params.txData, ret(checkCallCode, done));
            });
        });

    });

    describe('.accounts', function () {

        describe('#getAccounts', function () {
            it("should get all accounts", function (done) {
                var filter = util.createFilter("balance", ">", "110000000000");
                thel.accounts().getAccounts(filter, ret(checkAccounts, done));
            });
        });

        describe('#getAccount', function () {
            it("should get the account", function (done) {
                thel.accounts().getAccount(caddr, ret(checkAccount, done));
            });
        });

        describe('#getStorage', function () {
            it("should get the storage", function (done) {
                thel.accounts().getStorage(caddr, ret(checkStorage, done));
            });
        });

        describe('#getStorageAt', function () {
            it("should get the storage at the given key", function (done) {
                thel.accounts().getStorageAt(caddr, params.storageKey, ret(checkStorageAt, done));
            });
        });

    });

    describe('.blockchain', function () {

        describe('#getInfo', function () {
            it("should get the blockchain info", function (done) {
                thel.blockchain().getInfo(ret(checkBlockchainInfo, done));
            });
        });

        describe('#getChainId', function () {
            it("should get the chain id", function (done) {
                thel.blockchain().getChainId(ret(checkChainId, done));
            });
        });

        describe('#getGenesisHash', function () {
            it("should get the genesis hash", function (done) {
                thel.blockchain().getGenesisHash(ret(checkGenesisHash, done));
            });
        });

        describe('#getLatestBlockHeight', function () {
            it("should get the latest block height", function (done) {
                thel.blockchain().getLatestBlockHeight(ret(checkLatestBlockHeight, done));
            });
        });

        describe('#getBlocks', function () {
            it("should get the blocks between min, and max height", function (done) {
                thel.blockchain().getBlocks(params.minHeight, params.maxHeight, ret(checkBlocks, done));
            });
        });


        /*
         describe('#getBlock', function () {
         it("should get the block at the given height", function (done) {
         thel.blockchain().getBlock(params.height, ret(checkBlock, done));
         });
         });
         */

    });

});

function ret(checkFunc, done) {
    return function (error, data) {
        console.log(error);
        asrt.ok(error === null, "Error");
        console.log(data);
        checkFunc(data, done);
    };
}


// Accounts
function checkAccounts(data, done) {
    done();
}

function checkAccount(data, done) {
    done();
}

function checkStorage(data, done) {
    done();
}

function checkStorageAt(data, done) {
    done();
}

// Blockchain
function checkBlockchainInfo(data, done) {
    done();
}

function checkChainId(data, done) {
    done();
}

function checkGenesisHash(data, done) {
    done();
}

function checkLatestBlockHeight(data, done) {
    done();
}

function checkBlocks(data, done) {
    done();
}

function checkBlock(data, done) {
    done();
}

// Consensus
function checkConsensusState(data, done) {
    done();
}

function checkValidators(data, done) {
    done();
}

// Network
function checkNetworkInfo(data, done) {
    done();
}

function checkMoniker(data, done) {
    done();
}

function checkListening(data, done) {
    done();
}

function checkPeers(data, done) {
    done();
}

// Txs
function checkUnconfirmedTxs(data, done) {
    var tx = data.txs[0][1];
    console.log(tx);
    done();
}

/*
 function checkBroadcastTx(data, done){
 done();
 }
 */

function checkTransact(data, done) {
    done();
}

function checkTransactCC(data, done) {
    asrt.equal(data.contract_addr, caddr);
    done();
}

function checkCall(data, done) {
    done();
}

function checkCallCode(data, done) {
    done();
}