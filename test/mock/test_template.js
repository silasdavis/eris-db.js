var rpc = require('../../lib/rpc/rpc');

exports.getHandlers = function(testData){
    var handlers = {};

    handlers[rpc.methodName("getAccounts")] = function(param){return testData.output.accounts};
    handlers[rpc.methodName("getAccount")] = function(param){return testData.output.account};
    handlers[rpc.methodName("getStorage")] = function(param){return testData.output.storage};
    handlers[rpc.methodName("getStorageAt")] = function(param){return testData.output.storage_at};
    handlers[rpc.methodName("genPrivAccount")] = function(param){return testData.output.gen_priv_account};
    handlers[rpc.methodName("getBlockchainInfo")] = function(param){return testData.output.blockchain_info};
    handlers[rpc.methodName("getChainId")] = function(param){return testData.output.chain_id};
    handlers[rpc.methodName("getGenesisHash")] = function(param){return testData.output.genesis_hash};
    handlers[rpc.methodName("getLatestBlockHeight")] = function(param){return testData.output.latest_block_height};
    handlers[rpc.methodName("getLatestBlock")] = function(param){return testData.output.latest_block};
    handlers[rpc.methodName("getBlocks")] = function(param){return testData.output.blocks};
    handlers[rpc.methodName("getBlock")] = function(param){return testData.output.block};
    handlers[rpc.methodName("getConsensusState")] = function(param){return testData.output.consensus_state};
    handlers[rpc.methodName("getValidators")] = function(param){return testData.output.validators};
    handlers[rpc.methodName("getNetworkInfo")] = function(param){return testData.output.network_info};
    handlers[rpc.methodName("getClientVersion")] = function(param){return testData.output.client_version};
    handlers[rpc.methodName("getMoniker")] = function(param){return testData.output.moniker};
    handlers[rpc.methodName("getChainId")] = function(param){return testData.output.chain_id};
    handlers[rpc.methodName("isListening")] = function(param){return testData.output.listening};
    handlers[rpc.methodName("getListeners")] = function(param){return testData.output.listeners};
    handlers[rpc.methodName("getPeers")] = function(param){return testData.output.peers};
    handlers[rpc.methodName("getPeer")] = function(param){return testData.output.peer};
    handlers[rpc.methodName("transact")] = function(param){
        if(param.address == "") {
            return testData.output.tx_create_receipt;
        } else {
            return testData.output.tx_receipt;
        }
    };
    handlers[rpc.methodName("getUnconfirmedTxs")] = function(param){return testData.output.unconfirmed_txs};
    handlers[rpc.methodName("callCode")] = function(param){return testData.output.call_code};
    handlers[rpc.methodName("eventSubscribe")] = function(param){return {sub_id: "1234123412341234123412341234123412341234123412341234123412341234"}};
    handlers[rpc.methodName("eventUnsubscribe")] = function(param){return {result: true}};
    handlers[rpc.methodName("eventPoll")] = function(param){return {events: []}};

    return handlers;
};