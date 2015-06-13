var fs = require('fs-extra');
var path = require('path');
var cp = require('child_process');
var child = null;

// TODO needs improvement. Temp solution.
/**
 * Start a locally running server process.
 *
 * @param {string} executableName - Name of the server-server executable.
 * @param {function} callback - No argument function.
 */
exports.startLocalServer = function (executableName, callback) {
    child = cp.exec(executableName);
    child.stdout.on('data', function (data) {
        console.log(data);
    });
    child.stderr.on('data', function (data) {
        console.log(data);
    });
    child.stderr.on('close', function (data) {
        console.error("EXITING SERVER PROCESS PREMATURELY: " + data);
        child = null;
    });
    process.on('exit', function(){killProc(child)});
    callback();
};

/**
 * Stop the locally running server process.
 *
 * @param callback - No argument function.
 */
exports.stopLocalServer = function (callback) {
    // TODO Fix this...
    if (child) {
        child.kill();
    }
};

function killProc(child){
    if(child){
        console.log("Terminating child process.");
        child.kill();
        child = null;
    }
    console.log("Closing down local server.")
}