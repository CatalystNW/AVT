# This Dockerfile is a work in progress
FROM ubuntu:18.04

WORKDIR /usr/src/Catalyst-AppVetting
RUN mkdir -p $WORKDIR/script/

COPY ./script/init-install.sh $WORKDIR/script/
RUN $WORKDIR/script/init-install.sh

COPY ./.env* $WORKDIR/

# Since .env file exists before running this build step, running init-configure.sh is not mandatory here
RUN sh -c "if [ ! -f '$WORKDIR/.env' ]; then echo 'Docker Build Error: Please make sure .env file exists in your home folder' && exit 1; fi"
COPY ./script/init-configure.sh $WORKDIR/script/
RUN $WORKDIR/script/init-configure.sh

COPY package.json package-lock.json ./
RUN npm install --unsafe-perm
COPY . .
# WORKDIR /usr/src/Catalyst-AppVetting

# COPY package.json package.json
# COPY package-lock.json package-lock.json

# RUN npm install

# COPY ./controllers/createInitialUsers.js ./controllers/createInitialUsers.js
# COPY ./models/userPackage.js ./models/userPackage.js
# COPY ./mongoose/connection.js ./mongoose/connection.js
# COPY ./script/ ./script/
# COPY ./.env ./.env

# ARG AVT_ENVIRONMENT=${AVT_ENVIRONMENT}
# ARG AVT_RESTORE_FROM_BACKUP=${AVT_RESTORE_FROM_BACKUP}
# ARG AVT_RESTORE_FROM_BACKUP_FOLDER=${AVT_RESTORE_FROM_BACKUP_FOLDER}
# ARG AVT_GIT_BRANCH=${AVT_GIT_BRANCH}
# ARG AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
# ARG AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
# ARG AWS_S3_RESTORE_BUCKET=${AWS_S3_RESTORE_BUCKET}
# ARG AWS_S3_BACKUP_BUCKET=${AWS_S3_BACKUP_BUCKET}
# ARG AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
# ARG CATALYST_USER_EMAIL=${CATALYST_USER_EMAIL}
# ARG CATALYST_USER_PASSWORD=${CATALYST_USER_PASSWORD}
# ARG CATALYST_USER_FIRST_N=${CATALYST_USER_FIRST_N}
# ARG CATALYST_USER_LAST_N=${CATALYST_USER_LAST_N}
# ARG DB_USERNAME=${DB_USERNAME}
# ARG DB_PASSWORD=${DB_PASSWORD}
# ARG DB_AUTHSOURCE=${DB_AUTHSOURCE}
# ARG DB_HOST=${DB_HOST}
# ARG DB_PORT=${DB_PORT}
# ARG DB_NAME=${DB_NAME}
# ARG AVT_SERVER_PORT=${AVT_SERVER_PORT}

# RUN ls
RUN ./script/start-mongod.sh && ./script/createServiceUsers.sh && ./script/stop-mongod.sh

# RUN ./script/start-mongod.sh && ./script/db-restore.sh -yes ./script/stop-mongod.sh

# COPY . .

EXPOSE 8000

CMD ./script/docker-start.sh