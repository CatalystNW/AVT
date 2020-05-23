/***
 * Helper Functions for Care Network
 */

// var db = require('../mongoose/connection');
var User = require('../../models/userPackage');

module.exports.isLoggedIn = isLoggedIn;
module.exports.create_user_context = create_user_context;
module.exports.create_care_context = create_care_context;


// Uses Promises to retrieve user info. Returns context object
function create_user_context(req) {
  var myPromise = new Promise((resolve, reject) => {
    var result = undefined;
    if(req.isAuthenticated()) {
      var userID = req.user._id.toString();
      var result = User.findOne({"_id": userID}).lean();
    }
    resolve(result);
  });

  return myPromise.then( (result) => {
    var context = {carenetwork: true};
    if (result) {
      context.user_email = result.contact_info.user_email;
      context.user_roles = result.user_roles;
      context.user = true;
    }
    return context;
  });
}

//check to see if user is logged in and a vetting agent or site or an admin
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect('/user/login');
  }
}

function create_care_context(req, res) {
  var context = {carenetwork: true};
  if(!req.isAuthenticated()) {
    return context;
  }

  if (req.user) {
    var user = req.user;

    context.user_email = user.contact_info.user_email;
    context.user_roles = user.user_roles;
    context.user = true;

    var roles = user.user_roles;

    for (var i=0; i<roles.length; i++) {
      if (roles[i] == 'CARE_MANAGER') {
        context.care_manager_status = true;
        break;
      }
    }
  }

  
  return context;
}