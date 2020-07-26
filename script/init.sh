#! /bin/bash
# This script can be run as following:
#   export AVT_GIT_BRANCH=develop && export AVT_AUTO_S3=no && curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/${AVT_GIT_BRANCH}/script/init-curl.sh | sudo bash -

set -e
cd "$(dirname "$0")/.."
TITLE="\e[96mInitialization Script for Catalyst AppVetting Tool v0.2.0 by Rohin Adalja\e[0m"
SETUP="\n\e[93mINIT\e[0m"

echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

./script/init-install.sh
./script/init-configure.sh
reset
sudo bash ./script/init-setup.sh