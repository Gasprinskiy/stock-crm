#!/bin/bash
export ROOT=../docker/

cd ../jrpc-server/

rm log.txt
touch log.txt

cd $ROOT

docker compose build
docker compose up