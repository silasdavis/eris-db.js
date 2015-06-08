/**
 * @file blockchain.js
 * @fileOverview Factory module for the BlockChain class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module blockchain
 */
'use strict';

var util = require('./util');
var rpc = require('./rpc/rpc');

/**
 * Create a new instance of the BlockChain class.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end object.
 * @returns {BlockChain} - A new instance of the Blockchain class.
 */
exports.createInstance = function (backEnd) {
    return new BlockChain(backEnd);
};

/**
 * BlockChain has methods for querying the blockchain, getting individual blocks etc.
 *
 * @param {module:rpc/backend~NetworkingBackEnd} backEnd - The networking back-end.
 * @augments module:util~ComponentBase
 * @constructor
 */
function BlockChain(backEnd) {
    util.ComponentBase.call(this, backEnd);
}

/**
 * Get blockchain info.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getInfo = function (callback) {
    this._backEnd.send(rpc.methodName("getBlockchainInfo"), null, callback);
};

/**
 * Get the chain id.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getChainId = function (callback) {
    this._backEnd.send(rpc.methodName("getChainId"), null, callback);
};

/**
 * Get the genesis hash.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getGenesisHash = function (callback) {
    this._backEnd.send(rpc.methodName("getGenesisHash"), null, callback);
};

/**
 * Get the latest block height.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getLatestBlockHeight = function (callback) {
    this._backEnd.send(rpc.methodName("getLatestBlockHeight"), null, callback);
};

/**
 * Get the latest block.
 *
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getLatestBlock = function (callback) {
    this._backEnd.send(rpc.methodName("getLatestBlock"), null, callback);
};

/**
 * Get the blocks from 'minHeight' to 'maxHeight'.
 *
 * TODO out of bounds checks?
 *
 * @param {number} [minHeight=0] - First block-number.
 * @param {number} [maxHeight=latestHeight] - Last block-number.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getBlocks = function (minHeight, maxHeight, callback) {
    if(typeof(minHeight) !== "number"){
        minHeight = 0
    }
    if(typeof(maxHeight) !== "number"){
        maxHeight = 0
    }
    this._backEnd.send(rpc.methodName("getBlocks"), rpc.blocksParam(minHeight, maxHeight), callback);
};

/**
 * Get the block with the given block-number, or 'height'.
 *
 * @param {number} height - The block height.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
BlockChain.prototype.getBlock = function (height, callback) {
    this._backEnd.send(rpc.methodName("getBlock"), rpc.heightParam(height), callback);
};