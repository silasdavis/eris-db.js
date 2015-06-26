/**
 * @file index.js
 * @fileOverview Index file for the eris-db javascript API. This file contains a factory method
 * for creating a new <tt>ErisDB</tt> instance.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module index
 */
'use strict';

var erisdb = require('./lib/erisdb');
var validation = require('./lib/validation');
var wsc = require('./lib/rpc/websocket');
var httpc = require('./lib/rpc/http');

/**
 * ErisDB allows you to do remote calls to a running erisdb-tendermint client.
 *
 * @param {string} URL The RPC endpoint URL.
 * @param {boolean} [websockets] - Whether to use websockets. Will use http if not set.
 * @returns {module:erisdb-ErisDB}
 */
exports.createInstance = function(URL, websockets){
    var client;
    var ws = false;
    if (typeof(websockets) === "boolean" && websockets ){
        ws = true;
        if(typeof(URL) !== "string"){
            URL = 'ws://localhost:1337/socketrpc';
        }
        client = wsc.createInstance(URL);
    } else {
        if(!URL) {
            URL = 'http://localhost:1337/rpc';
        }
        client = httpc.createInstance(URL);
    }
    var validator = new validation.SinglePolicyValidator(true);
    return erisdb.createInstance(client, validator);
};

/**
 * ErisDB allows you to do remote calls to a running erisdb-tendermint client.
 *
 * @param {module:rpc/client~Client} client - A client object.
 * @param {module:validation~CallValidator} [validator] - a validator for determining if unsafe operations can be done.
 * @returns {module:erisdb-ErisDB}
 */
exports.createInstanceFromClient = function(client, validator){
    if(!validator){
        validator = new validation.SinglePolicyValidator(true);
    }
    return erisdb.createInstance(client, validator);
};