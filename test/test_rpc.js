
/* This file is for testing RPC methods generally. The erisdb-tendermint node is dispensed by the "server server",
 * and is seeded by the validator (privValidator) file and genesis.json, along with generic server and
 * tendermint configuration files.
 *
 * With the given input, we always expect the same output in terms of newly generated addresses, hashes, etc.
 * This means we can assume that certain fields will in the data we receive will always be the same. Here
 * are some important objects found in the gaggle of variables below:
 *
 * serverServerURL - address to the server server.
 * privValidator - the private validator used for consensus, and also to send transactions.
 * genesis - the configuration of the genesis block.
 * params - some values we use as in-data.
 * results - the expected results.
 *
 * Each test will call the corresponding API method and pass in a callback that will compare the return
 * data and compare it to the expected values.
 *
 * This will be cleaned up later, and become better.
 *
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

// Test params.
var params = {
    account: privValidator.address,
    privKey: privValidator.priv_key[1],
    storageKey: "",
    minHeight: 0,
    maxHeight: 1,
    height: 44,
    txData: "",
    txCode: "5B33600060006101000A81548173FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF021916908302179055505B6102828061003B6000396000F3006000357C01000000000000000000000000000000000000000000000000000000009004806337F428411461004557806340C10F191461005A578063D0679D341461006E57005B610050600435610244565B8060005260206000F35B610068600435602435610082565B60006000F35B61007C600435602435610123565B60006000F35B600060009054906101000A900473FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1673FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF163373FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1614156100DD576100E2565B61011F565B80600160005060008473FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1681526020019081526020016000206000828282505401925050819055505B5050565B80600160005060003373FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF168152602001908152602001600020600050541061015E57610163565B610240565B80600160005060003373FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF16815260200190815260200160002060008282825054039250508190555080600160005060008473FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1681526020019081526020016000206000828282505401925050819055507F93EB3C629EB575EDAF0252E4F9FC0C5CCADA50496F8C1D32F0F93A65A8257EB560003373FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1681526020018373FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF1681526020018281526020016000A15B5050565B6000600160005060008373FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF16815260200190815260200160002060005054905061027D565B91905056",
    txGasLimit: 0,
    txFee: 0
};

// Test result objects.

var validatorObj = {
    address: privValidator.address,
    pub_key: privValidator.pub_key,
    bond_height: 0,
    unbond_height: 0,
    last_commit_height: 0,
    voting_power: 5000000000,
    accum: 0
};
var new_contract_address = "9FC1ECFCAE2A554D4D1A000D0D80F748E66359E3";
var moniker = 'anothertester';
var listening = false;
var listeners = [];
var peers = [];
var genesis_hash = 'DA4F4DC4A54620F1E0AA1213631C4DC2957B7415E3F8C066C30009BC57C4E5FC';
var latest_block_height = 0;
var height = 0;

var txCreate = { input:
    { address: privValidator.address,
    amount: 1000,
    sequence: 1,
    signature:
        [ 1,
            '39E1D98C2F4F8FC5A98442C55DCC8FCBCE4ADB0F6BAD5C5258CEFE94EFB0315EA9616CC275F97E4D04C5A8FD08D73B84A28B7CFEAEE98F4A37E2F2BCA1830907' ],
    pub_key: privValidator.pub_key
    },
    address: '',
    gas_limit: 1000,
    fee: 1000,
    data: params.txCode
};

var tx = { input:
    {
        address: privValidator.address,
        amount: 1000,
        sequence: 3,
        signature:
            [ 1,
                '8D84089EC1140C5AF474DB7E764E937D9C6309BA0AD7BCC56108A2075504005AE2EE1AD71C3D414F9D793D2BFAD77C9572D9494736E6F3D1A62D17DF4A01090D' ],
        pub_key: null
    },
    address: new_contract_address,
    gas_limit: 1000,
    fee: 1000,
    data: ''
};


var results = {
    new_contract_address: new_contract_address,
    consensus_state: {
        height: 1,
        round: 0,
        step: 1,
        start_time: "",
        commit_time: '0001-01-01 00:00:00 +0000 UTC',
        validators: [validatorObj],
        proposal: null
    },
    validators: {
        block_height: 0,
        bonded_validators: [validatorObj],
        unbonding_validators: []
    },
    network_info: {
        moniker: moniker,
        listening: listening,
        listeners: listeners,
        peers: peers
    },
    moniker: {
        moniker: moniker
    },
    listening: {
        listening: listening
    },
    listeners: {
        listeners: listeners
    },
    peers: peers,
    receiptContractCreate: {
        tx_hash: 'C1C84BCD4CCA6D6132D1E702FA4A7618DBCDB52F',
        creates_contract: 1,
        contract_addr: '9FC1ECFCAE2A554D4D1A000D0D80F748E66359E3'
    },
    receiptTransact: {
        tx_hash: 'A40873D4C7136F6D79476A035D4265781FC20A3B',
        creates_contract: 0,
        contract_addr: ''
    },
    txs: { txs: [ [ 2, txCreate ], [ 2, tx ] ] },
    // TODO this seems weird.
    callCode: { return: '6000357c01000000000000000000000000000000000000000000000000000000009004806337f428411461004557806340c10f191461005a578063d0679d341461006e57005b610050600435610244565b8060005260206000f35b610068600435602435610082565b60006000f35b61007c600435602435610123565b60006000f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156100dd576100e2565b61011f565b80600160005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055505b5050565b80600160005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541061015e57610163565b610240565b80600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555080600160005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f93eb3c629eb575edaf0252e4f9fc0c5ccada50496f8c1d32f0f93a65a8257eb560003373ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020016000a15b5050565b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905061027d565b91905056',
        gas_used: 0
    },

    accounts: {
        accounts: [
            {
                address: '0000000000000000000000000000000000000002',
                pub_key: null,
                sequence: 0,
                balance: 565000000000,
                code: '',
                storage_root: ''
            },
            {
                address: '0000000000000000000000000000000000000004',
                pub_key: null,
                sequence: 0,
                balance: 110000000000,
                code: '',
                storage_root: ''
            },
            {
                address: '37236DF251AB70022B1DA351F08A20FB52443E37',
                pub_key: null,
                sequence: 0,
                balance: 110000000000,
                code: '',
                storage_root: ''
            },
            {
                address: '9E54C9ECA9A3FD5D4496696818DA17A9E17F69DA',
                pub_key: null,
                sequence: 0,
                balance: 525000000000,
                code: '',
                storage_root: ''
            },
            {
                address: 'F81CB9ED0A868BD961C4F5BBC0E39B763B89FCB6',
                pub_key: null,
                sequence: 0,
                balance: 690000000000,
                code: '',
                storage_root: ''
            }

        ]
    },
    account: {
        address: '9FC1ECFCAE2A554D4D1A000D0D80F748E66359E3',
        pub_key: null,
        sequence: 0,
        balance: 0,
        code: '',
        storage_root: ''
    },
    storage: { storage_root: '', storage_items: [] },
    storage_item: { key: '', value: '' },
    blockchain_info: {
        chain_id: genesis.chain_id,
        genesis_hash: genesis_hash,
        latest_block_height: height,
        latest_block: null
    },
    chain_id: {
        chain_id: genesis.chain_id
    },
    genesis_hash: {
        hash: genesis_hash
    },
    latest_block_height: {
        height: latest_block_height
    },
    block: null,
    blocks: { min_height: 0, max_height: 0, block_metas: [] }
};

var edb;

describe('TheloniousHttp', function () {

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
                edb = edbModule.createInstance(URL);
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
                edb.consensus().getState(ret(checkConsensusState, done));
            });
        });

        describe('#getValidators', function () {
            it("should get the validators", function (done) {
                edb.consensus().getValidators(ret(checkValidators, done));
            });
        });

    });

    describe('.network', function () {

        describe('#getInfo', function () {
            it("should get the network info", function (done) {
                edb.network().getInfo(ret(checkNetworkInfo, done));
            });
        });

        describe('#getMoniker', function () {
            it("should get the moniker", function (done) {
                edb.network().getMoniker(ret(checkMoniker, done));
            });
        });

        describe('#isListening', function () {
            it("should get the listening value", function (done) {
                edb.network().isListening(ret(checkListening, done));
            });
        });

        describe('#getListeners', function () {
            it("should get the listeners", function (done) {
                edb.network().getListeners(ret(checkListeners, done));
            });
        });

        describe('#getPeers', function () {
            it("should get the peers", function (done) {
                edb.network().getPeers(ret(checkPeers, done));
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
                edb.txs().transact(params.privKey, "", params.txCode,
                    params.txGasLimit, params.txFee, ret(checkTransactCC, done));
            });
        });

        describe('#transact', function () {
            it("should transact with the account at the given address", function (done) {
                edb.txs().transact(params.privKey, results.new_contract_address,
                    params.txData, params.txGasLimit, params.txFee,
                    ret(checkTransact, done));
            });
        });

        describe('#getUnconfirmedTxs', function () {
            it("should get the unconfirmed txs", function (done) {
                edb.txs().getUnconfirmedTxs(ret(checkUnconfirmedTxs, done));
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
                edb.txs().callCode(params.txCode, params.txData, ret(checkCallCode, done));
            });
        });

    });

    describe('.accounts', function () {

        describe('#getAccounts', function () {
            it("should get all accounts", function (done) {
                edb.accounts().getAccounts(ret(checkAccounts, done));
            });
        });

        describe('#getAccount', function () {
            it("should get the account", function (done) {
                edb.accounts().getAccount(results.new_contract_address, ret(checkAccount, done));
            });
        });

        describe('#getStorage', function () {
            it("should get the storage", function (done) {
                edb.accounts().getStorage(results.new_contract_address, ret(checkStorage, done));
            });
        });

        describe('#getStorageAt', function () {
            it("should get the storage at the given key", function (done) {
                edb.accounts().getStorageAt(results.new_contract_address, params.storageKey, ret(checkStorageAt, done));
            });
        });

    });

    describe('.blockchain', function () {

        describe('#getInfo', function () {
            it("should get the blockchain info", function (done) {
                edb.blockchain().getInfo(ret(checkBlockchainInfo, done));
            });
        });

        describe('#getChainId', function () {
            it("should get the chain id", function (done) {
                edb.blockchain().getChainId(ret(checkChainId, done));
            });
        });

        describe('#getGenesisHash', function () {
            it("should get the genesis hash", function (done) {
                edb.blockchain().getGenesisHash(ret(checkGenesisHash, done));
            });
        });

        describe('#getLatestBlockHeight', function () {
            it("should get the latest block height", function (done) {
                edb.blockchain().getLatestBlockHeight(ret(checkLatestBlockHeight, done));
            });
        });

        describe('#getBlocks', function () {
            it("should get the blocks between min, and max height", function (done) {
                edb.blockchain().getBlocks(params.minHeight, params.maxHeight, ret(checkBlocks, done));
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

function ret(checkFunc, done) {
    return function (error, data) {
        if (error) {
            console.log(error);
        }
        asrt.ok(error === null, "Error");
        checkFunc(data, done);
    };
}


// Accounts
function checkAccounts(data, done) {
    asrt.deepEqual(data, results.accounts);
    done();
}

function checkAccount(data, done) {
    asrt.deepEqual(data, results.account);
    done();
}

function checkStorage(data, done) {
    asrt.deepEqual(data, results.storage);
    done();
}

function checkStorageAt(data, done) {
    asrt.deepEqual(data, results.storage_item);
    done();
}

// Blockchain
function checkBlockchainInfo(data, done) {
    asrt.deepEqual(data, results.blockchain_info);
    done();
}

function checkChainId(data, done) {
    asrt.deepEqual(data, results.chain_id);
    done();
}

function checkGenesisHash(data, done) {
    asrt.deepEqual(data, results.genesis_hash);
    done();
}

function checkLatestBlockHeight(data, done) {
    asrt.deepEqual(data, results.latest_block_height);
    done();
}

function checkBlocks(data, done) {
    asrt.deepEqual(data, results.blocks);
    done();
}

function checkBlock(data, done) {
    asrt.deepEqual(data, results.block);
    done();
}

// Consensus
function checkConsensusState(data, done) {
    // We can't set this value in advance, but convenient to make deep equal check.
    results.consensus_state.start_time = data.start_time;

    asrt.deepEqual(data, results.consensus_state);
    done();
}

function checkValidators(data, done) {
    asrt.deepEqual(data, results.validators);
    done();
}

// Network
function checkNetworkInfo(data, done) {
    asrt.deepEqual(data, results.network_info);
    done();
}

function checkMoniker(data, done) {
    asrt.equal(data.moniker, moniker);
    done();
}

function checkListening(data, done) {
    asrt.equal(data.listening, listening);
    done();
}

function checkListeners(data, done) {
    asrt.deepEqual(data.listeners, listeners);
    done();
}

// TODO Quirk. Peers is an array (the only one). Haven't gotten to fixing that yet.
function checkPeers(data, done) {
    asrt.deepEqual(data, peers);
    done();
}

// Txs
function checkUnconfirmedTxs(data, done) {
    asrt.deepEqual(data, results.txs);
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
    asrt.equal(data.contract_addr, results.new_contract_address);
    done();
}

function checkCall(data, done) {
    asrt.deepEqual(data, results.call);
    done();
}

function checkCallCode(data, done) {
    asrt.deepEqual(data, results.callCode);
    done();
}