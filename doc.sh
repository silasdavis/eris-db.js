#!/usr/bin/env bash

rm -rf ./doc
jsdoc -t ./node_modules/ink-docstrap/template -c ./jsdoc_cfg/jsdoc.conf.json ./index.js ./lib/*.js ./lib/rpc/*.js README.md -d ./doc/