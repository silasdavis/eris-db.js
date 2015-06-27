var runner = require('../ws_executor.node');
var runnable = require("./tx_and_check");
var pk = require('../chain_data').priv_validator.priv_key[1];

runner.runWs(runnable, pk);