#! /bin/bash

cd "$(dirname "$0")/.."
BIN_PATH=./node_modules/.bin

./script/start-mongod.sh
sleep 3

$BIN_PATH/forever start -o /usr/src/logs/server.log -e /usr/src/logs/server.log ./bin/www
$BIN_PATH/forever logs 0 -f