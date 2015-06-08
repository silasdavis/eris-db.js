#!/usr/bin/env bash

rm -rf ./doc
jsdoc ./index.js ./lib/*.js ./lib/rpc/*.js ./test/mock/*.js README.md -d ./doc/ --access all