#! /bin/bash
cd "$(dirname "$0")/.."
BIN_PATH=./node_modules/.bin

$BIN_PATH/forever stopall