var chainData = require('../chain_data');
var edb;
var contractAddress;
var privKey;

// Run the example with the given erisdb and private key.
exports.run = function (erisdb, privKeyInput, callback) {
    edb = erisdb;
    privKey = privKeyInput;
    start(callback);
};

/************************************************************************************************/

// create a new contract. chain_data.js has the non-compiled solidity code.
// params: key, target address, data, gas, fee, context (for validation, usually null), callback.
function start(callback) {
    edb.txs().transact(privKey, "", chainData.contractByteCode, 1000, 1000, null,
        function (error, data) {
            if (error) {
                throw new Error(error);
            }
            console.log("Sent transaction. The address used for the new contract: " + data.contract_addr);
            console.log("");
            contractAddress = data.contract_addr;
            console.log("Reserved contract address: " + contractAddress);
            console.log("Waiting for consensus round to finish, which will commit the transaction into a block.");
            console.log("This should take around 12-15 seconds.");
            // We add an empty start callback because we're not going to stop the sub, just disconnect,
            // so we don't need the subscription object. Subs as well as new blockchain nodes are automatically
            // removed on the server side.
            edb.events().subNewBlocks(function () {
            }, function (error, data) {
                if (error) {
                    throw error;
                }
                if (data.data.txs.length === 0) {
                    return;
                }
                console.log(data.data.txs[0]);
                // When data arrives.
                edb.txs().call(contractAddress, "", function (error, data) {
                    if (error) {
                        throw new Error(error);
                    }

                    console.log("Contract created. Latest caller:");
                    console.log(data.storage_items[0].value.slice(24));
                    console.log("");
                    callback();

                });
            })
        });
}