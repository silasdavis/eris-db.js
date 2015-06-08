/**
 * @file network.js
 * @fileOverview Factory module for the Network class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module network
 */
'use strict';

var util = require('./util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the Network class.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end object.
 * @returns {Network} - A new instance of the Network class.
 */
exports.createInstance = function(backEnd){
    return new Network(backEnd);
};

/**
 * Network has methods that deals with the peer-to-peer network.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Network(backEnd){
    util.ComponentBase.call(this, backEnd);
}

/**
 * Get the network info.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getInfo = function(callback){
    this._backEnd.send(rpc.methodName("getNetworkInfo"), null, callback);
};

/**
 * Get the moniker
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getMoniker = function(callback){
    this._backEnd.send(rpc.methodName("getMoniker"), null, callback);
};

/**
 * Check if the node is listening for new peers.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.isListening = function(callback){
    this._backEnd.send(rpc.methodName("isListening"), null, callback);
};

/**
 * Get the list of network listeners.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getListeners = function(callback){
    this._backEnd.send(rpc.methodName("getListeners"), null, callback);
};

/**
 * Get a list of all connected peers.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getPeers = function(callback){
    this._backEnd.send(rpc.methodName("getPeers"), null, callback);
};

/**
 * Get a single peer based on their address.
 * @param {string} address - The IP address of the peer. // TODO
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Network.prototype.getPeer = function(address, callback){
    this._backEnd.send(rpc.methodName("getPeers"), rpc.peerParam(address), callback);
};