#!/usr/bin/env bash

rm -rf ./doc
jsdoc -t ./node_modules/ink-docstrap/template -c ./node_modules/ink-docstrap/template/jsdoc.conf.json ./index.js ./lib/*.js ./lib/rpc/*.js README.md -d ./doc/