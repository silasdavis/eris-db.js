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

var serverServerURL = "http://localhost:1337/server";

var test_data = require('./../../testdata/testdata.json');

var requestData = {
    priv_validator: test_data.chain_data.priv_validator,
    genesis: test_data.chain_data.genesis,
    max_duration: 30
};

var edb;
var eventSub;

describe('TheloniousHttpEvents', function () {

    before(function (done) {
        this.timeout(4000);

        util.getNewErisServer(serverServerURL, requestData, function(err, port){
            if(err){
                throw err;
            }
            edb = edbModule.createInstance("http://localhost:" + port + '/rpc');
            done();
        })
    });

    describe('.events', function () {

        describe('#subNewBlock', function () {
            it("should subscribe to new block events", function (done) {
                this.timeout(25000);
                console.log("This should take about 15 seconds.");
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

// TODO add this to test data. Start doing more serious event testing.
/*
 { chain_id: 'my_tests',
 height: 1,
 time: 'Fri Jun 26 20:32:13 +0200 2015',
 fees: 0,
 num_txs: 0,
 last_block_hash: '',
 last_block_parts: { total: 0, hash: '' },
 state_hash: 'DA4F4DC4A54620F1E0AA1213631C4DC2957B7415E3F8C066C30009BC57C4E5FC' },
 validation: { commits: [] },
 data: { txs: [] } }
 */