/**
 * @file consensus.js
 * @fileOverview Factory module for the Events class.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module consensus
 */
'use strict';

var util = require('./util');
var rpc = require('./rpc/rpc');

// The interval for polling.
var defaultPollingInterval = 1000;

/**
 * Create a new instance of the Events class. Events allow callers to listen for specific
 * events that are being fired by the server; one example being whenever a new block
 * has been added to the chain, or the code in a specific contract account is being run.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @returns {Events} - A new instance of the Events class.
 */
exports.createInstance = function(client){
    return new Events(client);
};

/**
 * The Events class deals with event subscriptions.
 *
 * @param {module:rpc/client~Client} client - The client object.
 * @augments module:util~ComponentBase
 * @constructor
 */
function Events(client){
    util.ComponentBase.call(this, client);
}

/**
 * Subscribe to a given event.
 *
 * @param {string} eventId - The event id.
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Events.prototype.subscribe = function(eventId, callback){
    this._client.send(rpc.methodName("eventSubscribe"), rpc.eventIdParam(eventId), callback);
};

/**
 * Unsubscribe to a given event.
 *
 * @param {string} subId - The subscription id (provided as a response to subscribe).
 * @param {module:rpc/rpc~methodCallback} callback - The callback function.
 */
Events.prototype.unsubscribe = function(subId, callback){
    this._client.send(rpc.methodName("eventUnsubscribe"), rpc.subIdParam(subId), callback);
};

/**
 * Poll for new event data.
 *
 * @param {string} subId - The subscription id (provided as a response to subscribe).
 * @param {module:rpc/rpc~methodCallback} callback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type.
 */
Events.prototype.poll = function(subId, callback){
    this._client.send(rpc.methodName("eventPoll"), rpc.subIdParam(subId), callback);
};

/**
 * Subscribe for account intput events.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subAccountInput = function(address, createCallback, eventCallback){
    var eventId = accInputId(address);
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for account output events.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subAccountOutput = function(address, createCallback, eventCallback){
    var eventId = accOutputId(address);
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for account receive events.
 *
 * @param {string} address - The account to be tracked.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subAccountReceive = function(address, createCallback, eventCallback){
    var eventId = accReceiveId(address);
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for bond events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subBonds = function(createCallback, eventCallback){
    var eventId = bondId();
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for unbond events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subUnbonds = function(createCallback, eventCallback){
    var eventId = unbondId();
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for rebond events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subRebonds = function(createCallback, eventCallback){
    var eventId = rebondId();
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for dupeout events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subDupeouts = function(createCallback, eventCallback){
    var eventId = dupeoutId();
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for new block events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subNewBlocks = function(createCallback, eventCallback){
    var eventId = newBlockId();
    this._startEventSub(eventId, createCallback, eventCallback);
};

/**
 * Subscribe for fork events.
 *
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 */
Events.prototype.subForks = function(createCallback, eventCallback){
    var eventId = forkId();
    this._startEventSub(eventId, createCallback, eventCallback);
};


/**
 * Create a new event subscription with the default polling interval.
 * @param {string} eventId - The event id.
 * @param {module:rpc/rpc~methodCallback} createCallback - Callback for when the subscription has
 * been created. The data returned is a new EventSub object.
 * @param {module:rpc/rpc~methodCallback} eventCallback - The callback function. The callback
 * will receive a (potentially empty) array of events of the given type every time a polling
 * call is made, or an error.
 * @private
 */
Events.prototype._startEventSub = function(eventId, createCallback, eventCallback){
    var es = new EventSub(this, eventId, eventCallback);
    es.start(createCallback);
};

/**
 * An event subscription is an object that is used to poll the server continuously to check whether
 * any new events has arrived on the event channel.
 *
 * // TODO really pass in the events object? Generally clean this up.
 *
 * @param {Events} events - The Events object.
 * @param {string} eventId - The event id.
 * @param {module:rpc/rpc~methodCallback} eventCallback - Callback for handling incoming data. The data
 * will be an array of events.
 * @constructor
 */
function EventSub(events, eventId, eventCallback){
    this._run = false;
    this._events = events;
    this._eventId = eventId;
    this._interval = defaultPollingInterval;
    this._eventCallback = eventCallback;
    this._closeCallback = function(){};
}

/**
 * Start listening for new events.
 * @param {module:rpc/rpc~methodCallback} callback - Provides this EventSub instance as data, or an error if it
 * fails to set up a subscription.
 */
EventSub.prototype.start = function(callback){
    var that = this;
    this._events.subscribe(this._eventId, function(error, data){
        if(error){
            callback(error);
            return;
        }
        that._subId = data.sub_id;
        that._run = true;
        // Start polling.
        setTimeout(function(){that._call()}, that._interval);
        callback(null, that);
    });
};

// TODO some cleanup here.
EventSub.prototype._call = function(){
    console.log(this._run);
    if (!this._run){
        this._events.unsubscribe(this._subId, this._closeCallback);
        return;
    }
    // Poll may return a number of events, so we break it down into multiple
    // calls.
    var that = this;
    this._events.poll(this._subId, function(err, data) {
        if(err !== null){
            that._eventCallback(err);
            that._events.unsubscribe(that._subId, that._closeCallback);
            that._run = false;
            return;
        }
        if(data === null  || data.events.length === 0){
            return;
        }

        for(var i = 0; i < data.events.length; i++){
            that._eventCallback(null, data.events[i]);
        }
    });
    if (!this._run){
        this._events.unsubscribe(this._subId, this._closeCallback);
        return;
    }
    setTimeout(function(){that._call()}, this._interval);

};

/**
 * Stop subscribing. This will stop the polling loop and send an unsubscribe message to the server.
 *
 * @param {module:rpc/rpc~methodCallback} [closeCallback] - Called when the subscription has been
 * canceled. This is optional, and will overwrite any close callback that was set when starting.
 */
EventSub.prototype.stop = function(closeCallback){
    console.log(this);
    if(typeof(closeCallback) === "function"){
        this._closeCallback = closeCallback;
    }
    this._run = false;
};

/**
 * Modify the polling interval. Will take effect when the next polling call is made.
 * @param {number} interval - The polling interval in <tt>milliseconds</tt>.
 */
EventSub.prototype.setInterval = function(interval){
    this._interval = (interval > 0) ? interval : defaultPollingInterval;
};

/**
 * Get the subscriber id.
 * @returns {string}
 */
EventSub.prototype.getSubscriberId = function(){
    return this._subId;
};

/**
 * Get the event id.
 * @returns {string}
 */
EventSub.prototype.getEventId = function(){
    return this._eventId;
};

/**
 * Get account input event id.
 * @param {string} address - The account address.
 * @returns {string}
 */
function accInputId(address) {
    return "Acc/" + address + "/Input";
}

/**
 * Get account output event id.
 * @param {string} address - The account address.
 * @returns {string}
 */
function accOutputId(address) {
    return "Acc/" + address + "/Output";
}

/**
 * Get account receive event id.
 * @param {string} address - The account address.
 * @returns {string}
 */
function accReceiveId(address) {
    return "Acc/" + address + "/Receive";
}

/**
 * Get bond event id.
 * @returns {string}
 */
function bondId() {
    return "Bond";
}

/**
 * Get unbond event id.
 * @returns {string}
 */
function unbondId() {
    return "Unbond";
}

/**
 * Get rebond event id.
 * @returns {string}
 */
function rebondId() {
    return "Rebond";
}

/**
 * Get dupeout event id.
 * @returns {string}
 */
function dupeoutId() {
    return "Dupeout";
}

/**
 * Get new block event id.
 * @returns {string}
 */
function newBlockId() {
    return "NewBlock";
}

/**
 * Get fork event id.
 * @returns {string}
 */
function forkId() {
    return "Fork";
}