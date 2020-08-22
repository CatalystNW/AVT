#! /bin/bash

cd "$(dirname "$0")/.."

./script/start-mongod.sh
sleep 1
./script/start-node.sh