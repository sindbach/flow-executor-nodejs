# flow-executor-nodejs
Executor Docker image for NodeJS


## Build 
```sh
docker build . -t executor-nodejs 

docker tag executor-nodejs ghcr.io/sindbach/flow-executor-nodejs:v0.1
docker tag executor-nodejs ghcr.io/sindbach/flow-executor-nodejs:latest

docker push ghcr.io/sindbach/flow-executor-nodejs:v0.1
docker push ghcr.io/sindbach/flow-executor-nodejs:latest
```

## Execute

```sh
./executor.sh "mongodb://host.docker.internal:27017" 
```