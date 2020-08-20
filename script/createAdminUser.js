/*

createAdminUser -- creates an admin user in the mongo db
Requires mongod to be running and ./config.js to contain:

createAdminUser: {
  email: 'example@example.com',
  password: 'examplePassword',
}

*/

// require('dotenv').config({ path: require('find-config')('.env') });
const yargs = require('yargs');

const argv = yargs
  .options({
    'first': {
      alias: 'f',
      describe: 'First name',
      demandOption: true
    },
    'last': {
      alias: 'l',
      describe: 'Last name',
      demandOption: true
    },
    'email': {
      alias: 'e',
      describe: 'Email',
      demandOption: true
    },
    'password': {
      alias: 'p',
      describe: 'Password',
      demandOption: true
    }
  })
  .help()
  .argv


var createInitialUsers = require('../controllers/createInitialUsers');

var adminUser = {
  "contact_info": {
    "user_email": argv.email,
    "user_name": {
      "user_first": argv.first || 'Catalyst',
      "user_middle": "",
      "user_last": argv.last || 'User',
      "user_preferred": ""
    },
    "user_dob": {
      "dob_date": "1988-09-14T00:00:00.000Z"
    },
    "user_address": {
      "u_line1": "asdf",
      "u_line2": "asdf",
      "u_city": "asdf",
      "u_state": "asdf",
      "u_zip": "98238"
    },
    "user_emergency": {
      "uec_name": "asdf",
      "uec_relationship": "asdf",
      "uec_phone": "adsf"
    }
  },
  "password": argv.password,
  "password-confirm": argv.password,
  "user_status": "ACTIVE",
  "user_documents": {
    "ID_Date": "2020-01-01",
    "waiver_signed": true,
    "background_check": true,
    "ID_badge": true
  },
  "user_created": 1492547010917,
  "user_role": "ADMIN",
  "user_roles": ["ADMIN", "VET", "SITE", "PROJECT_MANAGEMENT"]
}

createInitialUsers.postInitialUser({ body: adminUser }, { send: () => {} });
