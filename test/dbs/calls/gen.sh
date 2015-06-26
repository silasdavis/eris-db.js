#!/usr/bin/env bash

if [[ -z $(command -v erisdb) ]]; then
    echo "Cannot find erisdb executable on path"
    exit 1
fi
if [[ -z $(command -v node) ]]; then
    echo "Cannot find node executable on path"
    exit 1
fi
(erisdb "$(pwd -P)/dbfolder") & EDBPID=$!
# Give it some time (if needed).
sleep 1
node generate.js
kill ${EDBPID} &> /dev/null
exit 0