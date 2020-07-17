#! /bin/bash
# This script can be run as following:
#   export AVT_GIT_BRANCH=develop && curl https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/${AVT_GIT_BRANCH}/script/init-curl.sh | sudo bash -

set -e
TITLE="\e[96mCatalyst AppVetting Tool v0.1.0\e[0m"

apt-get update && apt-get install git -y

echo -e "\n$TITLE"
cd /usr/src

if [ -d Catalyst-AppVetting ]; then
  echo -e "\nERROR: Not a fresh install: '/usr/src/Catalyst-AppVetting' already exists! Quitting.\n"
  exit 1
fi

git clone https://github.com/dandahle/Catalyst-AppVetting.git
cd Catalyst-AppVetting/
git checkout ${AVT_GIT_BRANCH}
./script/init.sh