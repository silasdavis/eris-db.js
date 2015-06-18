#!/usr/bin/env bash
browserify index.js --standalone edbFactory > ./dist/eris-db.js
browserify ./test/test_rpc.js > ./test/browser/test_js/test_rpc.js
browserify ./test/test_rpc_ws.js > ./test/browser/test_js/test_rpc_ws.js
browserify ./test/test_rpc_events.js > ./test/browser/test_js/test_rpc_events.js
browserify ./test/test_rpc_events_ws.js > ./test/browser/test_js/test_rpc_events_ws.js
browserify ./test/test_rpc_filters.js > ./test/browser/test_js/test_rpc_filters.js