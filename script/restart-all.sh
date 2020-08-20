#! /bin/bash

cd "$(dirname "$0")/.."

./script/stop-all.sh
sleep 1
./script/start-all.sh
