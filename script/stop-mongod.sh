#! /bin/bash
cd "$(dirname "$0")/.."
#BIN_PATH=./node_modules/.bin

# if [ -x "$(command -v systemctl)" ]; then
#   systemctl stop mongod
# else
  pkill -2 mongod
  pkill mongod
# fi

sleep 1