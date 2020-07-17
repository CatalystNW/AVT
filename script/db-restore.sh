#!/bin/bash

cd "$(dirname "$0")/.."

set -a
source .env
set +a

CONTINUE=$1
DB_BACKUP_FOLDER=db_backups
DB_BACKUPS_DIR=/usr/src/$DB_BACKUP_FOLDER
YEAR=$(date +\%Y)

case "$AVT_RESTORE_FROM_BACKUP" in
    [yY][eE][sS]|[yY]) 
        echo -e "\n"
        ;;
    *)
          echo -e "AVT | SKIPPING RESTORE SCRIPT: ENV VAR 'RESTORE_FROM_BACKUP' is not set to 'yes'"
          exit 0
        ;;
esac

# Automatically find the latest backup to restore from if not provided
if [ "$AVT_RESTORE_FROM_BACKUP_FOLDER" == "latest" ]; then
    FOLDER=$(aws s3 ls s3://$AWS_S3_RESTORE_BUCKET/$DB_BACKUP_FOLDER/ | awk '{print $2}' | sort | grep $YEAR | tail -1)
else
    FOLDER=${AVT_RESTORE_FROM_BACKUP_FOLDER}
fi

if [ -z "$FOLDER" ]; then
  echo -e "\nAVT | RESTORE BACKUP SCRIPT: [ ERROR ]  Make sure a backup folder exists for the current year to restore from.\n"
  exit 1
fi

echo -e "AVT | RESTORE BACKUP SCRIPT: Your S3 BUCKET NAME is $AWS_S3_RESTORE_BUCKET"
echo -e "AVT | Restoring from: s3://$AWS_S3_RESTORE_BUCKET/$DB_BACKUP_FOLDER/$FOLDER"
echo -e "AVT | Restoring to: $DB_BACKUPS_DIR/restore-$FOLDER\n"


case "$CONTINUE" in
    [-][yY][eE][sS]|[yY]) 
        echo -e "\nAVT | Automated Run: Starting Restore..."
        ;;
    *)
          read -r -p "Are you sure? [y/N] " response
          case "$response" in
              [yY][eE][sS]|[yY]) 
                  echo -e "\nAVT | Starting Restore..."
                  ;;
              *)
                  echo -e "AVT | Skipping Restore... (In the future, you can run ./script/db-restore.sh to restore later on)"
                  ;;
          esac
        ;;
esac

mkdir $DB_BACKUPS_DIR/restore-$FOLDER
cd $DB_BACKUPS_DIR/restore-$FOLDER

aws s3 cp s3://$AWS_S3_RESTORE_BUCKET/$DB_BACKUP_FOLDER/$FOLDER . --recursive

mongorestore $DB_BACKUPS_DIR/restore-$FOLDER/catalyst --authenticationDatabase admin -d catalyst

echo -e "AVT | Restore Complete...\n"