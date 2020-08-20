#! /bin/bash
cd "$(dirname "$0")/.."
BIN_PATH=./node_modules/.bin

if [ -x "$(command -v sudo)" ]; then
  SUDO_CMD=sudo
fi

$SUDO_CMD $BIN_PATH/forever stopall