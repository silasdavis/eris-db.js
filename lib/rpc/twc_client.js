/**
 * @file client.js
 * @fileOverview Defines the Client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/client
 */

var nUtil = require('util');
var client = require('./client');

exports.TWCClient = TWCClient;

/**
 * <tt>TWCClient</tt> is the base class for clients that allows two-way communication, such
 * as a websocket client.
 * @constructor
 */
function TWCClient(URL) {
    client.Client.call(this, URL);
    /**
     * Storing requests until their responses comes back.
     *
     * @type TODO
     *
     * @private
     */
    this._reqs = {};

    /**
     * Storing permanent callbacks until manually removed.
     *
     * @type TODO
     *
     * @private
     */
    this._callbacks = {};
}

nUtil.inherits(TWCClient, client.Client);

/**
 * Add a new callback manually. This will be used if no request callback
 * has been set up for a given request id. An example would be websocket
 * subscriptions that receive an id string when a subscription is made.
 * All events being returned from the server then uses the id for each
 * event.
 *
 * The callbacks are not automatically removed when used, like for regular
 * requests, but must be removed manually. A good subscriber class should
 * manage this.
 *
 * TODO namespace ids
 *
 * @param {string} reqId - The request id that
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 * @return {function} The current function on the reqId, or null
 */
TWCClient.prototype.addCallback = function(reqId, callback){
    var ret = null;
    if(this._callbacks.hasOwnProperty(reqId)) {
        ret = this._callbacks[reqId];
    }
    this._callbacks[reqId] = callback;
    return ret;
};

/**
 * Delete a callback.
 *
 * @param reqId
 * @return {boolean} Whether or not something was deleted.
 */
TWCClient.prototype.removeCallback = function(reqId){
    if(this._callbacks.hasOwnProperty(reqId)) {
        delete this._callbacks[reqId];
        return true;
    }
    return false;
};