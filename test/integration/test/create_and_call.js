'use strict';

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

var compiled = "60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b60d38061003f6000396000f30060606040523615603a576000357c010000000000000000000000000000000000000000000000000000000090048063a5f3c23b14609757603a565b606b5b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506068565b90565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60ac60048035906020018035906020015060c2565b6040518082815260200191505060405180910390f35b6000818301905060cd565b9291505056";
var input = "";
var address;

describe('HttpCreateAndCall', function () {

    it("should call a contract", function (done) {
        this.timeout(30 * 1000);

        require('../createDb')().spread(function (ipAddress, privateKey) {
          var edb = edbModule.createInstance("http://" + ipAddress + ":1337/rpc");

          edb.txs().transactAndHold(privateKey, "", compiled, 1000000, 0, null, function (error, data) {
            asrt.ifError(error);
            address = data.call_data.callee;
            edb.txs().call(address, input, function (error, data) {
              asrt.ifError(error);
              asrt.equal(data.return, "00000000000000000000000037236df251ab70022b1da351f08a20fb52443e37");
              done();
            });
          });
        });
    });

});
