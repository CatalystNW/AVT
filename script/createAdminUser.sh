#!/bin/bash

cd "$(dirname "$0")/.."

SETUP="\n\e[93mAVT || createAdminUser.sh:\e[0m"

# Source the .env file
# set -a
# source .env
# set +a
echo -e "$SETUP Please enter the following information for Catalyst Admin user creation:"
read -r -p "Enter the first name: " create_first
read -r -p "Enter the last name: " create_last
read -r -p "Enter the email: " create_email
read -r -p "Enter the password: " create_password

echo -e "We will be creating the following new user:"
echo -e "First name: $create_first"
echo -e "Last name: $create_last"
echo -e "Email [must contain '@']: $create_email"
echo -e "Password: $create_password"
read -r -p "Are you sure? [y/N] " create_confirm
case "$create_confirm" in
    [nN][oO]|[nN])
        echo -e "AVT | You did not create a new user. Make sure you already have a user created."
        echo -e "AVT | If you need to do this at a future time, you can run './script/createAdminUser.sh' manually."
        ;;
    *)
          node ./script/createAdminUser.js -f $create_first -l $create_last -e $create_email -p $create_password &
          sleep 3
        ;;
esac

sleep 2