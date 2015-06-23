/**
 * @file http.js
 * @fileOverview Factory module for the http client class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/http
 */
'use strict';

var client = require('./client');
var rpc = require('./rpc');
var HTTPRequest;

if (typeof(XMLHttpRequest) === "undefined") {
    HTTPRequest = require("xmlhttprequest").XMLHttpRequest;
} else {
    HTTPRequest = XMLHttpRequest;
}

/**
 * Create a new instance of the HTTPClient class.
 * @param {string} URL - The endpoint URL
 * @returns {HTTPClient}
 */
exports.createInstance = function (URL) {
    return new HTTPClient(URL);
};

/**
 * The <tt>HTTPClient</tt> class does RPCs over HTTP.
 *
 * @param {string} URL - The endpoint URL.
 * @augments module:rpc/client~Client
 * @constructor
 */
function HTTPClient(URL) {
    client.Client.call(this, URL);

    /**
     * The current request id. It is incremented by 1 for each request that's made.
     *
     * @type {number}
     *
     * @private
     */
    this._currentId = 1;

}

/**
 * @param {netStartCallback} callback - Called when everything is set up.
 */
HTTPClient.prototype.start = function(callback){
    this._isRunning = true;
    callback();
};

/**
 * Send a message. This method is used for all RPC (RMI) methods.
 *
 * @param {string} method - The rpc method name.
 * @param {?Object} params - The parameters object.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 *
 * @override
 */
HTTPClient.prototype.send = function (method, params, callback) {
    var id = this._nextId();
    var req = rpc.request(id, method, params);
    var msg = JSON.stringify(req);
    this.sendMsg(msg, "POST", function (err, data) {
        if (err) {
            callback(err);
        }
        var resp;

        try {
            resp = JSON.parse(data);
        } catch (err) {
            callback("Error when parsing json response: " + err + ": (" + data + ")");
            return;
        }
        if (!rpc.isResponse(resp)) {
            callback("Response object is not a proper json-rpc 2.0 response object.");
            return;
        }

        if (resp.error) {
            rpc.printError(resp);
            callback(resp.error);
        } else {
            callback(null, resp.result);
        }
    });
};

/**
 * Send a message. This method is used for all RPC (RMI) methods.
 *
 * @param {string} message - The message.
 * @param {string} method - The method.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 *
 * @override
 */
HTTPClient.prototype.sendMsg = function (message, method, callback) {
    var httpRequest = new HTTPRequest();
    httpRequest.onreadystatechange = function () {
        if (this.readyState == 4) {

            if (this.status < 200 || this.status > 299) {
                callback(this.responseText);
            } else {
                callback(null, this.responseText);
            }
        }
    };
    httpRequest.open(method, this._URL, true);
    if(method == "POST") {
        httpRequest.setRequestHeader("Content-Type", "application/json");
    }
    httpRequest.send(message);
};

/**
 * Get the next id.
 *
 * @returns {string} id - The id as a string.
 *
 * @private
 */
HTTPClient.prototype._nextId = function () {
    return (this._currentId++).toString();
};