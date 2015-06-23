#!/usr/bin/env bash

# Run live tests locally if erisdbss and erisdb is found.
# NOTE: These are just temporary, for dev, and will not be
# extended or improved. Not really meant for public use.

if [[ -z $(command -v erisdbss) ]]; then
    echo "Cannot find erisdbss executable on path"
    exit 2
fi
if [[ -z $(command -v erisdb) ]]; then
    echo "Cannot find erisdb executable on path"
    exit 3
fi
# Give it some time (if needed).
sleep 1
# Check if already running
SSOLDPID=$(pidof erisdbss)
if [[ -z ${SSOLDPID} ]]; then
    (erisdbss) & SSPID=$!
else
   echo "Using already running instance of erisdbss"
fi
mocha "./test/live/*.js"
# Don't really care whether it's already shut down or not.
kill ${SSPID} &> /dev/null
exit 0