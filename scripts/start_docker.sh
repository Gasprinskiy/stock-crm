#!/bin/bash

export ROOT=../docker/

cd $ROOT

docker compose build
docker compose up