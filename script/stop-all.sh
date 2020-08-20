#! /bin/bash
cd "$(dirname "$0")/.."

./script/stop-node.sh

./script/stop-mongod.sh
