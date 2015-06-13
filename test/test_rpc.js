
/* This file is for testing RPC methods.
 */

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

var testData = require('./testdata/testdata.json');

var edb;

describe('TheloniousHttp', function () {

    // TODO clean this up.
    before(function (done) {
        this.timeout(4000);
        var httpClient = require('../lib/rpc/http').createInstance(serverServerURL);
        var privValidator = testData.chain_config.priv_validator;
        var genesis = testData.chain_config.genesis;
        var msg = JSON.stringify({
            priv_validator: privValidator,
            genesis: genesis,
            max_duration: 10
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
                edb = edbModule.createInstance(URL + '/rpc');
                setTimeout(done, 3000);
            } else {
                console.log("ERROR FROM SERVER");
                console.log(err);
                done();
            }
        });
    });

    describe('.consensus', function () {

        describe('#getState', function () {
            it("should get the consensus state", function (done) {
                var exp = testData.output.consensus_state;
                edb.consensus().getState(check(exp, done));
            });
        });

        describe('#getValidators', function () {
            it("should get the validators", function (done) {
                edb.consensus().getValidators(check(exp, done));
            });
        });

    });

    describe('.network', function () {

        describe('#getInfo', function () {
            it("should get the network info", function (done) {
                edb.network().getInfo(check(exp, done));
            });
        });

        describe('#getMoniker', function () {
            it("should get the moniker", function (done) {
                edb.network().getMoniker(check(exp, done));
            });
        });

        describe('#isListening', function () {
            it("should get the listening value", function (done) {
                edb.network().isListening(check(exp, done));
            });
        });

        describe('#getListeners', function () {
            it("should get the listeners", function (done) {
                edb.network().getListeners(check(exp, done));
            });
        });

        describe('#getPeers', function () {
            it("should get the peers", function (done) {
                edb.network().getPeers(check(exp, done));
            });
        });

    });

    describe('.txs', function () {

        /*
         describe('#broadcastTx', function () {
         it("should broadcast a tx", function (done) {
         edb.txs().broadcastTx(params.tx, ret(checkBroadcastTx, done));
         });
         });
         */


        describe('#transact contract create', function () {
            it("should send a contract create tx to an address", function (done) {
                var tx_create = testData.input.tx_create;
                edb.txs().transact(tx_create.priv_key, tx_create.target_address, tx_create.data,
                    tx_create.gas_limit, tx_create.fee, check(exp, done));
            });
        });

        describe('#transact', function () {
            it("should transact with the account at the given address", function (done) {
                var tx = testData.input.tx;
                edb.txs().transact(tx.priv_key, tx.target_address, tx.data, tx.gas_limit, tx.fee,
                    check(exp, done));
            });
        });

        describe('#getUnconfirmedTxs', function () {
            it("should get the unconfirmed txs", function (done) {
                edb.txs().getUnconfirmedTxs(check(exp, done));
            });
        });

        /*
         describe('#call', function () {
         it("should call the given address using the given data", function (done) {
         edb.txs().call(results.new_contract_address, params.txData, ret(checkCall, done));
         });
         });
         */

        describe('#callCode', function () {
            it("should callCode with the given code and data", function (done) {
                var call_code = testData.input.call_code;
                edb.txs().callCode(call_code.code, call_code.data, check(exp, done));
            });
        });

    });

    describe('.accounts', function () {

        describe('#getAccounts', function () {
            it("should get all accounts", function (done) {
                edb.accounts().getAccounts(check(exp, done));
            });
        });

        describe('#getAccount', function () {
            it("should get the account", function (done) {
                edb.accounts().getAccount(check(exp, done));
            });
        });

        describe('#getStorage', function () {
            it("should get the storage", function (done) {
                edb.accounts().getStorage(results.new_contract_address, check(exp, done));
            });
        });

        describe('#getStorageAt', function () {
            it("should get the storage at the given key", function (done) {
                edb.accounts().getStorageAt(results.new_contract_address, params.storageKey, check(exp, done));
            });
        });

    });

    describe('.blockchain', function () {

        describe('#getInfo', function () {
            it("should get the blockchain info", function (done) {
                edb.blockchain().getInfo(check(exp, done));
            });
        });

        describe('#getChainId', function () {
            it("should get the chain id", function (done) {
                edb.blockchain().getChainId(check(exp, done));
            });
        });

        describe('#getGenesisHash', function () {
            it("should get the genesis hash", function (done) {
                edb.blockchain().getGenesisHash(check(exp, done));
            });
        });

        describe('#getLatestBlockHeight', function () {
            it("should get the latest block height", function (done) {
                edb.blockchain().getLatestBlockHeight(check(exp, done));
            });
        });

        describe('#getBlocks', function () {
            it("should get the blocks between min, and max height", function (done) {
                edb.blockchain().getBlocks(params.minHeight, params.maxHeight, check(exp, done));
            });
        });


        /*
         describe('#getBlock', function () {
         it("should get the block at the given height", function (done) {
         edb.blockchain().getBlock(params.height, ret(checkBlock, done));
         });
         });
         */

    });

});

function check(expected, done) {
    return function (error, data) {
        if (error) {
            console.log(error);
        }
        asrt.ok(error === null, "Error");
        asrt.Equal(data, expected);
        done();
    };
}