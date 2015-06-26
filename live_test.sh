#!/usr/bin/env bash
# Run live tests locally if erisdbss and erisdb is found.
# NOTE: This is a WIP and not really meant for public use.

ssFlags=( "basic" )
edbFlags=( "calls" )

function inputInSS(){
    for i in "${ssFlags[@]}"; do
        if [[ $1 == ${i} ]]; then
            return 0
        fi
    done
    return 1
}

function inputInEdb(){
    for i in "${edbFlags[@]}"; do
        if [[ $1 == ${i} ]]; then
            return 0
        fi
    done
    return 1
}

function validInput(){
    inputInSS $1
    VSS=$?
    inputInEdb $1
    VEDB=$?
    return $(( ${VSS} & ${VEDB} ))
}

function listFlags(){
    for i in "${ssFlags[@]}"
    do
        echo ${i}
    done
    for i in "${edbFlags[@]}"
    do
        echo ${i}
    done
}

function usage(){
    echo "**************************** Usage ****************************"
    echo "Usage: live_test.sh name"
    echo "name can be: "
    listFlags
    echo "***************************************************************"
}

function runErisdb(){
    # These are for tests that runs erisdb and provide it with the path
    # to an already existing working directory. These tests can only be
    # done locally (erisdb running locally).
    if [[ -z $(command -v erisdb) ]]; then
        echo "Cannot find erisdb executable on path"
        return 1
    fi
    if [[ -z $(command -v mocha) ]]; then
        echo "Cannot find mocha executable on path"
        return 1
    fi
    DBS="$(pwd -P)/test/dbs"
    TMPDBS="${DBS}/temp/"
    SRC="${DBS}$1/dbfolder"
    DEST=${TMPDBS}$1
    rm -rf "${TMPDBS}/*"
    cp ${SRC} ${DEST}
    (erisdb ${DEST}) & EDBPID=$!
    # Give it some time (if needed).
    sleep 1
    mocha "./test/live/$1/*.js"
    kill ${EDBPID} &> /dev/null
    rm -rf "./test/dbs/$1"
    return 0
}

function runErisdbss(){
    # These are for tests that use erisdbss (server-server) to create a
    # new node with some given settings like priv-validator and genesis.json.
    # Usually those settings are put in the javscript test files themselves.
    if [[ -z $(command -v erisdbss) ]]; then
        echo "Cannot find erisdbss executable on path"
        exit 1
    fi
    if [[ -z $(command -v erisdb) ]]; then
        echo "Cannot find erisdb executable on path"
        exit 1
    fi
    if [[ -z $(command -v mocha) ]]; then
        echo "Cannot find mocha executable on path"
        exit 1
    fi
    # Check if already running
    SSOLDPID=$(pidof erisdbss)
    if [[ -z ${SSOLDPID} ]]; then
        (erisdbss) & SSPID=$!
        # Give it some time (if needed).
        sleep 1
    else
       echo "Using already running instance of erisdbss"
    fi
    mocha "./test/live/$1/*.js"
    kill ${SSPID} &> /dev/null
    return 0
}

function main()
{
    if [[ -z "$1" ]]; then
        echo "Error: No arguments."
        usage
        exit 1
    fi
    validInput $1
    VI=$?
    if [[ ${VI} != 0 ]]; then
        echo "Error: Illegal argument: $1."
        usage
        exit 2
    else
        inputInSS $1
        if [[ $? == 0 ]]; then
            runErisdbss $1
        else
            runErisdb $1
        fi
        exit $?
    fi
    exit 0
}

# Start
main $1