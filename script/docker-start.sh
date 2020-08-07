#! /bin/bash

cd "$(dirname "$0")/.."
AVT_PARENT_DIR=/usr/src

BIN_PATH=./node_modules/.bin

./script/start-mongod.sh
sleep 3

$BIN_PATH/forever start -o $AVT_PARENT_DIR/logs/server.log -e $AVT_PARENT_DIR/logs/server.log ./bin/www
$BIN_PATH/forever logs 0 -f