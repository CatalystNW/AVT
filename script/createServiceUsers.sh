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

case "$AVT_CREATE_NEW_USER" in
    [yY][eE][sS]|[yY])
        node ./script/createAdminUser &
        sleep 3
        ;;
    *)
          echo -e "AVT | SKIPPING CREATING AVT ADMIN USER: ENV VAR 'AVT_CREATE_NEW_USER' is not set to 'yes'"
          echo -e "AVT | If you need to do this at a future time, you can run 'node /script/createAdminUser' manually."
        ;;
esac

sleep 1