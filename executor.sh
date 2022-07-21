#!/bin/bash
MONGODB_URI=${1}
GRAPH_ID=${2}
NODE_ID=${3}
DOCKER_IMAGE=ghcr.io/sindbach/flow-executor-nodejs:latest


SPACE=/workspace
COMMAND="npm --prefix /home/flow run wrapper"
echo "Executing ... "${COMMAND}
docker run --rm -e MONGODB_URI=${MONGODB_URI} -e GRAPH_ID=${GRAPH_ID} -e NODE_ID=${NODE_ID}\
    -v "$(pwd)":${SPACE} \
    -w ${SPACE}/ ${DOCKER_IMAGE} \
    "${COMMAND}"