#! /bin/bash
cd "$(dirname "$0")/.."
AVT_PARENT_DIR=/usr/src
#BIN_PATH=./node_modules/.bin

if [ -x "$(command -v sudo)" ]; then
  SUDO_CMD=sudo
fi

# systemctl start mongod
$SUDO_CMD mongod --dbpath $AVT_PARENT_DIR/db/ --logpath $AVT_PARENT_DIR/logs/mongod.log &
sleep 1