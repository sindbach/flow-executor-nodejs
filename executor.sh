#!/bin/bash
MONGODB_URI=${1}
DOCKER_IMAGE=ghcr.io/sindbach/flow-executor-nodejs:latest


SPACE=/workspace
COMMAND="npm --prefix /home/flow run wrapper"
echo "Executing ... "${COMMAND}
docker run --rm -e MONGODB_URI=${MONGODB_URI} \
    -v "$(pwd)":${SPACE} \
    -w ${SPACE}/ executor-nodejs \
    "${COMMAND}"