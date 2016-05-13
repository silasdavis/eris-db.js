/**
 * @file index.js
 * @fileOverview Index file for the eris-db javascript API. This file contains a factory method
 * for creating a new <tt>ErisDB</tt> instance.
 * @author Andreas Olofsson (andreas@erisindustries.com)
 * @module index
 */
'use strict'

var child_process = require('child_process')
var erisdb = require('./erisdb')
var fs = require('fs')
var PEG = require('pegjs')
var Promise = require('bluebird')
var R = require('ramda')

var parser
var dockerMachineIp

exports.open = erisdb.open

Promise.promisifyAll(child_process)

parser = PEG.buildParser(fs.readFileSync(__dirname + '/parser.pegjs',
  'utf8'))

// Memoize the Docker Machine IP lookup because of
// https://github.com/docker/machine/issues/2612.
dockerMachineIp = R.memoize(child_process.execAsync)

// Return the URL for an Eris service on a running container.
exports.serviceUrl = function (type, name, port) {
  return Promise.join(
    dockerMachineIp('docker-machine ip', {encoding: 'utf8'})
      .catchReturn('localhost'),

    child_process.execAsync('eris ' + type + ' inspect ' + name +
      ' NetworkSettings.Ports', {encoding: 'utf8'}).then(function (stdout) {
        return parser.parse(stdout)[port]
      }),
      function (hostname, port) {
        return {
          protocol: 'http:',
          slashes: true,
          hostname: hostname.trim(),
          port: port
        }
      })
}
