/* This file is for testing RPC methods.
 */

var util = require('../../../lib/util');
var asrt;
var edbModule;

if (typeof(window) === "undefined") {
    asrt = require('assert');
    edbModule = require("../../../index");
} else {
    asrt = assert;
    edbModule = edbFactory;
}

var testData = require('./../../testdata/testdata_filters.json');

var edb;

describe('ErisDbHttpFilters', function () {

    describe('#getAccounts', function () {
        this.timeout(30 * 1000);

        before(function (done) {
          require('../createDb')().spread(function (ipAddress, privateKey) {
            edb = edbModule.createInstance("http://" + ipAddress + ":1337/rpc");
            done();
          });
        });

        it("should get the filtered list of accounts", function (done) {
            var filters = testData.GetAccounts0.input;
            var exp = testData.GetAccounts0.output;
            edb.accounts().getAccounts(filters, check(exp, done));
        });

        it("should get the filtered list of accounts", function (done) {
            var filters = testData.GetAccounts1.input;
            var exp = testData.GetAccounts1.output;
            edb.accounts().getAccounts(filters, check(exp, done));
        });

        it("should get the filtered list of accounts", function (done) {
            var filters = testData.GetAccounts2.input;
            var exp = testData.GetAccounts2.output;
            edb.accounts().getAccounts(filters, check(exp, done));
        });

    });

});

// Expected is the expected data. done is the mocha done-function, modifiers are
// used to overwrite fields in the return-data that should not be included in the
// tests (like certain timestamps for example).
function check(expected, done, fieldModifiers) {
    return function (error, data) {
        if (error) {
            console.log(error);
        }
        if(fieldModifiers && fieldModifiers.length > 0){
            for (var i = 0; i < fieldModifiers.length; i++) {
                fieldModifiers[i](data);
            }
        }
        try {
          asrt.ifError(error, "Failed to call rpc method.");
          asrt.deepEqual(data, expected);
          done();
        }
        catch (exception) {
          done(exception);
        }
    };
}