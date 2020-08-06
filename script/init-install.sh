#! /bin/bash
set -e

TITLE="\e[96mInstall Script for Catalyst AppVetting Tool by Rohin Adalja\e[0m"
SETUP="\n\e[93mINSTALL\e[0m"

cd "$(dirname "$0")/.."
echo -e "\n$TITLE"
echo -e "$SETUP: Running in $(pwd)"

# Create folders under /usr/src
echo -e "$SETUP: Making initial app directories under $(pwd)"
echo -e "$SETUP: Creating 'db' folder"
[ -d db ] || mkdir db
echo -e "$SETUP: Creating 'db_backups' folder"
[ -d db_backups ] || mkdir db_backups
echo -e "$SETUP: Creating 'logs' folder"
[ -d logs ] || mkdir logs

chown -R ubuntu:ubuntu db
chown -R ubuntu:ubuntu db_backups
chown -R ubuntu:ubuntu logs

echo -e "$SETUP: Updating Ubuntu OS 18.04 Packages..."
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y git curl vim nano gnupg

# Install AWS Command Line Interface
echo -e "$SETUP: Installing AWS CLI..."
DEBIAN_FRONTEND=noninteractive apt-get install -y awscli

# Install Node v12.x.x
echo -e "$SETUP: Installing Node v12..."
curl -sL https://deb.nodesource.com/setup_12.x | bash -
DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs

# Install MongoDB v4.x.x
echo -e "$SETUP: Installing MongoDB v4..."
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
[ -f /etc/apt/sources.list.d/mongodb-org-4.0.list ] || echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y mongodb-org

echo -e "$SETUP: DONE: Install script"