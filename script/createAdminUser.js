/*

createAdminUser -- creates an admin user in the mongo db
Requires mongod to be running and ./config.js to contain:

createAdminUser: {
  email: 'example@example.com',
  password: 'examplePassword',
}

*/

require('dotenv').config({ path: require('find-config')('.env') });

var createInitialUsers = require('../controllers/createInitialUsers');

var adminUser = {
  "contact_info": {
    "user_email": process.env.CATALYST_USER_EMAIL,
    "user_name": {
      "user_first": process.env.CATALYST_USER_FIRST_N || 'Catalyst',
      "user_middle": "",
      "user_last": process.env.CATALYST_USER_LAST_N || 'Admin',
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
  "password": process.env.CATALYST_USER_PASSWORD,
  "password-confirm": process.env.CATALYST_USER_PASSWORD,
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
