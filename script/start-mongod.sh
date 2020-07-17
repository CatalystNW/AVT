#! /bin/bash
cd "$(dirname "$0")/.."
#BIN_PATH=./node_modules/.bin

# if [ -x "$(command -v systemctl)" ]; then
#   systemctl start mongod
# else
  mongod --dbpath /usr/src/db/ --logpath /usr/src/logs/mongod.log &
# fi

sleep 1