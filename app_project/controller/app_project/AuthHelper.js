/**
 * Helper functions to check authentication
 */

 var User = require('../../../models/userPackage');

 module.exports.isLoggedIn = isLoggedIn;
 module.exports.getUserContext = getUserContext;
 
 /**
  * Checks if user is logged in. If not, then redirects to login page.
  * @param {*} req 
  */
function isLoggedIn(req) {
  return req.isAuthenticated();
 }

async function getUserContext(req, res, redirectURL = "/user/login") {
  if (isLoggedIn(req)) {
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    const context = {};
    if (user) {
      context.user_email = user.contact_info.user_email;
      context.user_roles = user.user_roles;
      context.user = true;
    }
    return context;
  } else {
    res.redirect(redirectURL);
  }
}