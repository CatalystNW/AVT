#! /bin/bash
# This script can be run as following:
#   export AVT_GIT_BRANCH=develop && curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/${AVT_GIT_BRANCH}/script/init-curl.sh | sudo bash -

cd "$(dirname "$0")/.."

CONTINUE=$1
TITLE="\e[96mConfiguration Script for Catalyst AppVetting Tool\e[0m"
SETUP="\n\e[93mCONFIGURE\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

# Ask env vars - including branch and set it in env and source it

if [ -f ".env" ]; then
    echo -e "\nAVT | Reading configuration from .env!"
else
    echo -e "$SETUP: Let's set up the environment configuration..."
    echo -e "$SETUP: Soon: Press [a] to edit. When done, save the file to continue by typing [ESC] :wq!"
    echo -e "$SETUP: Opening..."
    sleep 3

    # Open editor to modify environment variables
    [ -f ".env" ] || cp .env.template .env
    chmod 777 .env
    vim .env

    sleep 2

    echo -e "$SETUP: Configured. Please run ./script/init-setup.sh"
fi
