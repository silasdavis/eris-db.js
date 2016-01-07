'use strict';

var
  fs = require('fs'),
  request = require('request-promise'),
  util = require('../../../lib/util');

var asrt;
var edbModule;

if (typeof(window) === "undefined") {
  asrt = require('assert');
  edbModule = require("../../../index");
} else {
  asrt = assert;
  edbModule = edbFactory;
}

var compiled;
var input = "";
var address;

// Compile a Solidity contract and return the bytecode as a buffer.
function compile(contract) {
  return request({
    method: 'POST',
    uri: 'http://compiler:9099/compile',
    body: {
      name: "mycontract",
      language: 'sol',
      script: Buffer(contract).toString('base64')
    },
    json: true
  }).then(function (response) {
    return Buffer(response.bytecode, 'base64');
  });
}

describe('HttpCreateAndCall', function () {
  before(function () {
    return compile(fs.readFileSync('test/testtx.sol')).
      then(function (bytecode) {
        compiled = Buffer(bytecode).toString('hex');
      });
  });

  it("should call a contract", function (done) {
    this.timeout(30 * 1000);

    require('../createDb')().spread(function (ipAddress, validator) {
      var
        edb, privateKey;

      edb = edbModule.createInstance("http://" + ipAddress + ":1337/rpc")
      privateKey = validator.priv_key[1];

      edb.txs().transactAndHold(privateKey, "", compiled, 1000000, 0, null,
        function (error, data) {
          asrt.ifError(error);
          address = data.call_data.callee;
          edb.txs().call(address, input, function (error, data) {
            asrt.ifError(error);

            asrt.equal(data.return.slice((32 - 20) * 2).toUpperCase(),
              validator.address);

            done();
          });
        });
    });
  });
});
