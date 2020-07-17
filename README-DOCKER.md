# Steps
  1. Install Docker for Desktop
  2. Clone git repository and enter the directory
  3. Copy the file `.env.template` as `.env` in the root directory and change it to your desired configuration
  4. RUN: `docker-compose build`
  5. RUN: `docker-compose up`
    i. To run in background: `docker-compose up -d`
   ii. Steps 4 and 5 can be combined as: `docker-compose up --build`
  6. To stop the running Ubuntu container, run `docker-compose down`
