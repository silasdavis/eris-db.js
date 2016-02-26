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

var compiled = "6060604052608f8060116000396000f30060606040523615600d57600d565b608d5b7f68616861000000000000000000000000000000000000000000000000000000007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f88c4f556fdc50387ec6b6fc4e8250fecc56ff50e873df06dadeeb84c0287ca9060016040518082815260200191505060405180910390a35b565b00";
var input = "";
var address;

describe('HttpCreateAndSolidityEvent', function () {

    it("should subscribe to a solidity event", function (done) {
        this.timeout(30 * 1000);

        require('../createDb')().spread(function (ipAddress, validator) {
          var
            privateKey;

          var edb = edbModule.createInstance("http://" + ipAddress + ":1337/rpc");

          privateKey = validator.priv_key[1];

          edb.txs().transactAndHold(privateKey, "", compiled, 1000000, 0, null, function (error, data) {
              var
                expected;

              asrt.ifError(error);
              address = data.call_data.callee;

              expected = {
                address: '000000000000000000000000' + address, // returns its own address, padded to 32 bytes
                topics: ['88C4F556FDC50387EC6B6FC4E8250FECC56FF50E873DF06DADEEB84C0287CA90',
                  'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
                  '6861686100000000000000000000000000000000000000000000000000000000'],
                data: '0000000000000000000000000000000000000000000000000000000000000001',
                height: 2
              };

              edb.events().subLogEvent(address, function (error, event) {
                  asrt.deepEqual(event, expected, "Event data does not match expected.");
                  done();
              });

              edb.txs().call("", address, input, function (error, data) {
                  asrt.ifError(error);
              });
            }
          );
        });
    });

});
