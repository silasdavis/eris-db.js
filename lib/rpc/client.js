/**
 * @file back_end.js
 * @fileOverview Defines the NetworkingBackEnd class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/backend
 */

exports.NetworkingBackEnd = Client;

/**
 * <tt>Client</tt> is the base class for all clients used by the library.
 * @constructor
 */
function Client(URL) {
    console.log(URL);
    if(!URL){
        throw new Error("No URL provided.");
    }

    this._URL = URL;
    this._isRunning = false;
}

/**
 * @param {netStartCallback} callback - Called when everything is set up.
 */
Client.prototype.start = function(callback){
    this._isRunning = true;
    callback();
};

/**
 *
 * @param {netShutdownCallback} callback - Called when everything has been shut down.
 */
Client.prototype.shutDown = function(callback){
    this._isRunning = false;
    callback();
};

/**
 * Is the system running?
 *
 * @returns {boolean}
 */
Client.prototype.isRunning = function(){
    return this._isRunning;
};

/**
 *
 * @param {string} method - The method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Client.prototype.send = function(method, params, callback){};

/**
 * The network startup callback.
 *
 * @callback netStartCallback
 * @param {error} error - Error.
 */

/**
 * The network shutdown callback.
 *
 * @callback netShutdownCallback
 * @param {error} error - Error.
 */