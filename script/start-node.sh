#! /bin/bash
cd "$(dirname "$0")/.."
BIN_PATH=./node_modules/.bin

if [ -x "$(command -v sudo)" ]; then
  SUDO_CMD=sudo
fi

$SUDO_CMD $BIN_PATH/forever start -o /usr/src/logs/server.log -e /usr/src/logs/server.log ./bin/www
# $BIN_PATH/forever logs 0 -f