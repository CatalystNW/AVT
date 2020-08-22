#! /bin/bash

set -e

cd "$(dirname "$0")/.."
AVT_PARENT_DIR=/usr/src

[ -d $AVT_PARENT_DIR/logs ] || mkdir $AVT_PARENT_DIR/logs/
touch $AVT_PARENT_DIR/logs/cron_s3.log

command="$AVT_PARENT_DIR/Catalyst-AppVetting/script/db-backup.sh -yes >> $AVT_PARENT_DIR/logs/cron_s3.log 2>&1"
job="00 23 * * * $command"
cat <(fgrep -i -v "$command" <(crontab -l)) <(echo "$job") | crontab -
