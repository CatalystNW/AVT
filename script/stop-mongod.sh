#! /bin/bash
cd "$(dirname "$0")/.."
#BIN_PATH=./node_modules/.bin

# if [ -x "$(command -v systemctl)" ]; then
#   systemctl stop mongod
# else
if [ -x "$(command -v sudo)" ]; then
  SUDO_CMD=sudo
fi

$SUDO_CMD pkill -2 mongod
$SUDO_CMD pkill mongod
# fi

sleep 1