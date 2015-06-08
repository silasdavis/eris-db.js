var asrt;
var thelModule;

if(typeof(window) === "undefined") {
    asrt = require('assert');
    thelModule = require("../../index");
} else {
    asrt = assert;
    thelModule = thelFact;
}

var params = {
    getAccountAddr: "0x0",
    getStorageAddr: "0x0",
    getStorageAtAddr: "0x0",
    getStorageAtKey: "0x0",
    minHeight: 0,
    maxHeight: 1,
    height: 1,
    transact: {
        privKey: "0x9118A217284DA5A6C17BE1862835632B677044459E601B18AB8CC116E7F12D1100A476EDBDDBDEDF7B3982773FE1407038852941A24CA2E9866C9761D6915CD6",
        address: "0xB02534CF6EDFBBDDFFFEB1DBEA3C3A2C603C330E",
        data: "0x0",
        gasLimit: 0,
        fee: 0
    },
    callAddress: "0x0",
    callData: "0x0",
    callCodeCode: "0x0",
    callCodeData: "0x0"
};

var thel = thelModule.createInstance("ws://localhost:1337/socketrpc", true);

describe('Thelonious Websocket', function () {

    before(function(done){
        thel.start(function (error) {
            if (error){
                throw new Error(error);
            }
            console.log("Started");
            done();
        });
    });

    describe('.accounts', function(){

        describe('#getAccounts', function () {
            it("should get all accounts", function (done) {
                thel.accounts().getAccounts(ret(checkAccounts, done));
            });
        });

        describe('#getAccount', function () {
            it("should get the account", function (done) {
                thel.accounts().getAccount(params.getAccountAddr, ret(checkAccount, done));
            });
        });

        describe('#getStorage', function () {
            it("should get the storage", function (done) {
                thel.accounts().getStorage(params.getStorageAddr, ret(checkStorage, done));
            });
        });

        describe('#getStorageAt', function () {
            it("should get the storage at the given key", function (done) {
                thel.accounts().getStorageAt(params.getStorageAtAddr, params.getStorageAtKey, ret(checkStorageAt, done));
            });
        });

    });

    describe('.blockchain', function(){

        describe('#getInfo', function () {
            it("should get the blockchain info", function (done) {
                thel.blockchain().getInfo(ret(checkBlockchainInfo, done));
            });
        });

        describe('#getGenesisHash', function () {
            it("should get the genesis hash", function (done) {
                thel.blockchain().getGenesisHash(ret(checkGenesisHash, done));
            });
        });

        describe('#getLastBlockHeight', function () {
            it("should get the latest block height", function (done) {
                thel.blockchain().getLatestBlockHeight(ret(checkLatestBlockHeight, done));
            });
        });

        describe('#getBlocks', function () {
            it("should get the blocks between min, and max height", function (done) {
                thel.blockchain().getBlocks(params.minHeight, params.maxHeight, ret(checkBlocks, done));
            });
        });

        describe('#getBlock', function () {
            it("should get the block at the given height", function (done) {
                thel.blockchain().getBlock(params.height, ret(checkBlock, done));
            });
        });

    });

    describe('.consensus', function(){

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

    describe('.network', function(){

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

        describe('#getNetworkId', function () {
            it("should get the network id", function (done) {
                thel.network().getNetworkId(ret(checkNetworkId, done));
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

    describe('.txs', function(){

        describe('#getUnconfirmedTxs', function () {
            it("should get the unconfirmed txs", function (done) {
                thel.txs().getUnconfirmedTxs(ret(checkUnconfirmedTxs, done));
            });
        });

        /*
         describe('#broadcastTx', function () {
         it("should broadcast a tx", function (done) {
         thel.txs().broadcastTx(params.tx, ret(checkBroadcastTx, done));
         });
         });
         */

        describe('#transact', function () {
            it("should transact with the account at the given address", function (done) {
                thel.txs().transact(params.transact.privKey, params.transact.address,
                    params.transact.data, params.transact.gasLimit, params.transact.fee,
                    ret(checkTransact, done));
            });
        });

        describe('#call', function () {
            it("should call the given address using the given data", function (done) {
                thel.txs().call(params.callAddress, params.callData, ret(checkCall, done));
            });
        });

        describe('#callCode', function () {
            it("should callCode with the given code and data", function (done) {
                thel.txs().callCode(params.callCodeCode, params.callCodeData, ret(checkCallCode, done));
            });
        });

    });

    // TODO
    describe('.events', function(){});

});


function ret(checkFunc, done){
    return function(error, data){
        if(error) {
            asrt.ifError(error);
            done();
            return;
        }
        console.log(data);
        checkFunc(data, done);
    };
}



// Accounts
function checkAccounts(data, done){
    done();
}

function checkAccount(data, done){
    done();
}

function checkStorage(data, done){
    done();
}

function checkStorageAt(data, done){
    done();
}

// Blockchain
function checkBlockchainInfo(data, done){
    done();
}

function checkGenesisHash(data, done){
    done();
}

function checkLatestBlockHeight(data, done){
    done();
}

function checkBlocks(data, done){
    done();
}

function checkBlock(data, done){
    done();
}

// Consensus
function checkConsensusState(data, done){
    done();
}

function checkValidators(data, done){
    done();
}

// Network
function checkNetworkInfo(data, done){
    done();
}

function checkMoniker(data, done){
    done();
}

function checkNetworkId(data, done){
    done();
}

function checkListening(data, done){
    done();
}

function checkPeers(data, done){
    done();
}

// Txs
function checkUnconfirmedTxs(data, done){
    done();
}

/*
function checkBroadcastTx(data, done){
    done();
}
*/

function checkTransact(data, done){
    done();
}

function checkCall(data, done){
    done();
}

function checkCallCode(data, done){
    done();
}