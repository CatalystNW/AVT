#!/bin/bash

cd "$(dirname "$0")/.."

# Source the .env file
set -a
source .env
set +a

mongo admin <<EOF
use admin;
db.createUser({ user: '$DB_USERNAME', pwd: '$DB_PASSWORD', roles: [{role:'userAdmin',db:'admin'}]});
exit
EOF

sleep 2