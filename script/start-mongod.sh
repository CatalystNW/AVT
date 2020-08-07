#! /bin/bash
cd "$(dirname "$0")/.."
#BIN_PATH=./node_modules/.bin

if [ -x "$(command -v sudo)" ]; then
  SUDO_CMD=sudo
fi
#   systemctl start mongod
# else
  $SUDO_CMD mongod --dbpath /usr/src/db/ --logpath /usr/src/logs/mongod.log &

sleep 1