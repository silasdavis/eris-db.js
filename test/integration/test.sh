#!/bin/sh

# Build a test environment for integration tests in a Docker container and run them.

docker build --tag test .

docker run --interactive --tty --rm \
  --env=DOCKER_HOST --env=DOCKER_TLS_VERIFY --env=DOCKER_CERT_PATH=/mnt/machine \
  --volume $HOME/.docker/machine/machines/default:/mnt/machine:ro --volume=$PWD/../..:/usr/src/app \
  test
