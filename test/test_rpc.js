/* This file is for testing RPC methods.
 */

var util = require('../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    localServ = require("./server_local/server");
    edbModule = require("../index");
} else {
    asrt = assert;
    edbModule = edbFact;
}

var serverServerURL = "http://localhost:1337/server";

var test_data = require('./testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 10
};

var edb;

describe('TheloniousHttp', function () {

    before(function (done) {
        this.timeout(4000);
        
        util.getNewErisServer(serverServerURL, requestData, function(err, URL){
            if(err){
                throw new Error(err);
            }
            edb = edbModule.createInstance(URL + '/rpc');
            done();
        })
    });

    describe('.consensus', function () {

        describe('#getState', function () {
            it("should get the consensus state", function (done) {
                var exp = test_data.output.consensus_state;
                // We must use custom validation here since we need to
                // modify a timestamp.
                edb.consensus().getState(function(err, data){
                    if (err) {
                        console.log(err);
                    }
                    asrt.ifError(err, "Failed to call rpc method.");
                    data.start_time = "";
                    var expected = test_data.output.consensus_state;
                    asrt.deepEqual(data, expected);
                    done();
                });
            });
        });

        describe('#getValidators', function () {
            it("should get the validators", function (done) {
                var exp = test_data.output.validators;
                edb.consensus().getValidators(check(exp, done));
            });
        });

    });

    describe('.network', function () {

        describe('#getInfo', function () {
            var exp = test_data.output.network_info;
            it("should get the network info", function (done) {
                edb.network().getInfo(check(exp, done));
            });
        });

        describe('#getMoniker', function () {
            var exp = test_data.output.moniker;
            it("should get the moniker", function (done) {
                edb.network().getMoniker(check(exp, done));
            });
        });

        describe('#isListening', function () {
            it("should get the listening value", function (done) {
                var exp = test_data.output.listening;
                edb.network().isListening(check(exp, done));
            });
        });

        describe('#getListeners', function () {
            it("should get the listeners", function (done) {
                var exp = test_data.output.listeners;
                edb.network().getListeners(check(exp, done));
            });
        });

        describe('#getPeers', function () {
            it("should get the peers", function (done) {
                var exp = test_data.output.peers;
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
                var tx_create = test_data.input.tx_create;
                var exp = test_data.output.tx_create_receipt;
                edb.txs().transact(tx_create.priv_key, tx_create.target_address, tx_create.data,
                    tx_create.gas_limit, tx_create.fee, check(exp, done));
            });
        });

        describe('#transact', function () {
            it("should transact with the account at the given address", function (done) {
                var tx = test_data.input.tx;
                var exp = test_data.output.tx_receipt;
                edb.txs().transact(tx.priv_key, tx.target_address, tx.data, tx.gas_limit, tx.fee,
                    check(exp, done));
            });
        });

        describe('#getUnconfirmedTxs', function () {
            it("should get the unconfirmed txs", function (done) {
                var exp = test_data.output.unconfirmed_txs;
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
                var call_code = test_data.input.call_code;
                var exp = test_data.output.call_code;
                edb.txs().callCode(call_code.code, call_code.data, check(exp, done));
            });
        });

    });

    describe('.accounts', function () {

        describe('#getAccounts', function () {
            it("should get all accounts", function (done) {
                var exp = test_data.output.accounts;
                edb.accounts().getAccounts(check(exp, done));
            });
        });

        describe('#getAccount', function () {
            it("should get the account", function (done) {
                var addr = test_data.input.account_address;
                var exp = test_data.output.account;
                edb.accounts().getAccount(addr, check(exp, done));
            });
        });

        describe('#getStorage', function () {
            it("should get the storage", function (done) {
                var addr = test_data.input.account_address;
                var exp = test_data.output.storage;
                edb.accounts().getStorage(addr, check(exp, done));
            });
        });

        describe('#getStorageAt', function () {
            it("should get the storage at the given key", function (done) {
                var addr = test_data.input.account_address;
                var sa = test_data.input.storage_address;
                var exp = test_data.output.storage_at;
                edb.accounts().getStorageAt(addr, sa, check(exp, done));
            });
        });

    });

    describe('.blockchain', function () {

        describe('#getInfo', function () {
            it("should get the blockchain info", function (done) {
                var exp = test_data.output.blockchain_info;
                edb.blockchain().getInfo(check(exp, done));
            });
        });

        describe('#getChainId', function () {
            it("should get the chain id", function (done) {
                var exp = test_data.output.chain_id;
                edb.blockchain().getChainId(check(exp, done));
            });
        });

        describe('#getGenesisHash', function () {
            var exp = test_data.output.genesis_hash;
            it("should get the genesis hash", function (done) {
                edb.blockchain().getGenesisHash(check(exp, done));
            });
        });

        describe('#getLatestBlockHeight', function () {
            it("should get the latest block height", function (done) {
                var exp = test_data.output.latest_block_height;
                edb.blockchain().getLatestBlockHeight(check(exp, done));
            });
        });

        describe('#getBlocks', function () {
            it("should get the blocks between min, and max height", function (done) {
                var range = test_data.input.block_range;
                var exp = test_data.output.blocks;
                edb.blockchain().getBlocks(range.min, range.max, check(exp, done));
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
        asrt.ifError(error, "Failed to call rpc method.");
        asrt.deepEqual(data, expected);
        done();
    };
}