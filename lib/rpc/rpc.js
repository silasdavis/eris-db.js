/**
 * @file rpc.js
 * @fileOverview Contains RPC functionality and objects.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module rpc/rpc
 */
'use strict';


var errors = {
    "-32700": "PARSE_ERROR",
    "-32600": "INVALID_REQUEST",
    "-32601": "METHOD_NOT_FOUND",
    "-32602": "INVALID_PARAMS",
    "-32603": "INTERNAL_ERROR"
};

var serviceName = "erisdb";

exports.methodName = function(str){
    return serviceName+ "." + str;
};

exports.request = function(id, method, params){
    return {
        jsonrpc: "2.0",
        method: method,
        params: params,
        id: id
    };
};

exports.printError = function(response){
    if(typeof(response) === "undefined" || response === null || typeof(response.error) === "undefined" ||
            response.error === null){
        return;
    }
    var error = response.error;
    var err = errors[error.code];
    if (err === undefined){
        err = "[JSON RPC 2.0 Error] Message Id: " + response.id + ", (UNDEFINED: " + code.toString() + ") - " + error.message;
    } else {
        err = "[JSON RPC 2.0 Error] Message Id: " + response.id + ", (" + err + ") - " + error.message;
    }
    console.log(err);
};

/**
 * Check if an object is a proper JSON-RPC 2.0 response object.
 * @param {*} response - The object to be tested.
 * @returns {boolean}
 */
exports.isResponse = function(response){
    return typeof(response.jsonrpc) === "string" && response.jsonrpc === "2.0" &&
        (response.result || response.error) && typeof(response.id) === "string";
};

exports.rpcServiceName = function() {
    return serviceName;
};

exports.accountsParam = function(filters){
    return {filters: filters};
};

exports.addressParam = function(address){
    return {address: address};
};

exports.storageAtParam = function(address, key){
    return {address: address, key: key};
};

exports.heightParam = function(height){
    return {height: height};
};

exports.blocksParam = function(filters){
    return {filters: filters};
};

exports.peerParam = function(address){
    return {address: address};
};

exports.eventIdParam = function(eventId){
    return {event_id: eventId};
};

exports.subIdParam = function(subId){
    return {sub_id: subId};
};

exports.callParam = function(address, data){
    return {address: address, data: data};
};

exports.callCodeParam = function(code, data){
    return {code: code, data: data};
};

exports.transactParam = function(privKey, address, data, gasLimit, fee){
    return {
        priv_key: privKey,
        address: address,
        data: data,
        gas_limit: gasLimit,
        fee: fee
    };
};

exports.signTxParam = function(tx, privAccounts){
    return {
        tx: tx,
        priv_accounts: privAccounts
    };
};

/**
 * The callback passed to all methods.
 *
 * @callback methodCallback
 * @param {Error} error - Error.
 * @param {Object} data - The return data.
 */