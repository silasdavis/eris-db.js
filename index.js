/**
 * @file index.js
 * @fileOverview Index file for the Thelonious javascript API. This file contains a factory method
 * for creating a new <tt>Thelonious</tt> instance.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module index
 */
'use strict';
var thelonious = require('./lib/thelonious');
var wsc = require('./lib/rpc/websocket');
var httpc = require('./lib/rpc/http');

/**
 * Thelonious allows you to do remote calls to a running thelonious-tendermint client.
 *
 * @param {string} URL The RPC endpoint URL.
 * @param {boolean} [websockets] - Whether to use websockets. Will use http if not set.
 * @returns {module:thelonious~Thelonious}
 */
exports.createInstance = function(URL, websockets){
    var client;
    if (typeof(websockets) === "boolean" && websockets ){
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
    return thelonious.createInstance(client);
};