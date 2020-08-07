#! /bin/bash -i
# This script can be run as following:
#   sudo AVT_GIT_BRANCH=aws-config AVT_AUTO_S3=catalyst-db-dev/env_files/.env-test bash -E -c "$(wget -O - https://raw.githubusercontent.com/dandahle/Catalyst-AppVetting/${AVT_GIT_BRANCH}/script/init-curl.sh)"

set -e
CONTINUE=$1

TITLE="\e[96mCatalyst AppVetting Tool v0.2.0\e[0m"

apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y git awscli

echo -e "\n$TITLE"
cd /usr/src

if [ -d Catalyst-AppVetting ]; then
  echo -e "\nERROR: Not a fresh install: '/usr/src/Catalyst-AppVetting' already exists! Quitting.\n"
  exit 1
fi

git clone https://github.com/dandahle/Catalyst-AppVetting.git
cd Catalyst-AppVetting/
git checkout ${AVT_GIT_BRANCH}

# Ask if you want to configure AWS S3 using manual credentials?
# TODO: Configure EC2 Instance to automatically have S3 bucket permissions (see: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html)

case "$CONTINUE" in
    [-][yY][eE][sS]|[yY]) 
        echo -e "\nAVT | Automated Run: Skipping manual AWS configure step."
        ;;
    *)
          echo "Do you want to run 'aws configure'?"
          read -r -p "Please enter your answer [y/N]: " response
          case "$response" in
              [yY][eE][sS]|[yY]) 
                  aws configure
                  ;;
              *)
                  echo -e "AVT | Not running 'aws configure'. Make sure S3 access is provided by AWS AMI or manually via environment variables if you want to use S3."
                  ;;
          esac
        ;;
esac

./script/auto-s3.sh
./script/init.sh