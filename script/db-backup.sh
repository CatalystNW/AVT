#!/bin/bash

cd "$(dirname "$0")/.."

set -a
source .env
set +a

CONTINUE=$1
DATE=$(date +\%Y-\%m-\%d:\%H:\%M:\%S)
DB_BACKUP_FOLDER=db_backups
DB_BACKUPS_DIR=/usr/src/$DB_BACKUP_FOLDER
DEST=$DB_BACKUPS_DIR/$DATE

mkdir $DEST
cd $DEST

echo -e "AVT | BACKUP SCRIPT: Your S3 BUCKET NAME is $AWS_S3_BACKUP_BUCKET"
echo -e "AVT | Backing up to: $DB_BACKUPS_DIR/$DATE"
echo -e "AVT | Uploading Backup to s3 at s3://$AWS_S3_BACKUP_BUCKET/$DB_BACKUP_FOLDER/$DATE\n"

case "$CONTINUE" in
    [-][yY][eE][sS]|[yY]) 
        echo -e "\nAVT | Automated Run: Starting Backup..."
        ;;
    *)
          read -r -p "Are you sure? [y/N] " response
          case "$response" in
              [yY][eE][sS]|[yY]) 
                  echo -e "\nAVT | Starting Backup..."
                  ;;
              *)
                  echo -e "AVT | Cancelled by user, exiting."
                  exit 1
                  ;;
          esac
        ;;
esac

echo -e "AVT | BACKUP SCRIPT: Running Mongodump..."
mongodump --authenticationDatabase admin -d catalyst -o $DEST

echo -e "AVT | BACKUP SCRIPT: Uploading a copy to S3..."
aws s3 cp $DEST s3://$AWS_S3_BACKUP_BUCKET/db_backups/$DATE --recursive

echo -e "AVT | Backup Complete!\n"