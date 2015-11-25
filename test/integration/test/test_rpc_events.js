/* This file is for testing an event.
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

var test_data = require('./../../testdata/testdata.json');

var eventSub;

describe('TheloniousHttpEvents', function () {
    describe('.events', function () {

        describe('#subNewBlock', function () {
            it("should subscribe to new block events", function (done) {
              this.timeout(30 * 1000);

              require('../createDb')().spread(function (ipAddress, privateKey) {
                var edb = edbModule.createInstance("http://" + ipAddress + ":1337/rpc");
                edb.events().subNewBlocks(function (err, data) {
                  asrt.ifError(err, "New block subscription error.");
                  eventSub = data;
                  setTimeout(function () {
                      data.stop(function () {
                          throw new Error("No data came in.");
                      })
                  }, 20000);

                }, function(err, data){
                    if(data){
                        eventSub.stop(function(){
                            done();
                        });
                    }
                });
              });
            });
        });

    });
});