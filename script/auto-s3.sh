#! /bin/bash

cd "$(dirname "$0")/.."

# Source the .env file
set -a
source .env
set +a

SETUP="\n\e[93mAVT | Auto S3 Script\e[0m"
echo -e "$SETUP: Running in $(pwd)"

if [ -z "$AVT_AUTO_S3" ]; then
    echo -e "$SETUP: NOT FETCHING ENV CONFIG FROM S3. You will be manually setting the .env file later."
else
    case "$AVT_AUTO_S3" in
    [nN][oO])
        echo -e "$SETUP: NOT FETCHING ENV CONFIG FROM S3. You will be manually setting the .env file later."
        ;;
    *)
          echo -e "$SETUP: GRABBING .env file from SPECIFIED S3 PATH: $AVT_AUTO_S3"
          aws s3 cp s3://$AVT_AUTO_S3 ../.env
          [ -f "../.env" ] || echo -e "$SETUP: ERROR - COULD NOT RETRIEVE .ENV FILE FROM S3 BUCKET. You can retry this by running './script/auto-s3.sh' at a later time..."
        ;;
    esac
    sleep 1
fi