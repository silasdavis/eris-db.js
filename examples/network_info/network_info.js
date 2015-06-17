var util = require("../../lib/util");
var edb;

// Run the example with the given erisdb and private key.
exports.run = function (erisdb, data, callback) {
    erisdb.network().getInfo(function (error, data) {
            if (error) {
                throw new Error(error);
            }
            console.log(data);
            callback();
        }
    );
};