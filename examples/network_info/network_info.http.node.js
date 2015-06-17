var runner = require('../http_executor.node');
var runnable = require("./network_info");

runner.runHttp(runnable, null);