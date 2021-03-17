/**
 * Helper functions to check authentication
 */

 var User = require('../../../models/userPackage');

 module.exports.checkLoggedInPages = checkLoggedInPages;
 module.exports.checkLoggedInAPI = checkLoggedInAPI;
 module.exports.isLoggedIn = isLoggedIn;
 module.exports.getUserContext = getUserContext;
 
 /**
  * Check for basic user account and redirects to login if none for the
  * rendering/ view pages. Runs next() if success.
  * 
  * Used at routing level to ensure basic logn requirement (authentication).
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
 function checkLoggedInPages(req, res, next) {
   if (req.isAuthenticated()) {
     next();
   } else {
     res.redirect("/user/login");
   }
 }

 /**
  * Check for basic user account and redirects to login if none for the
  * API requests. Runs next() if success.
  * 
  * Used at routing level to ensure basic logn requirement (authentication).
  * @param {*} req 
  * @param {*} res 
  * @param {*} next 
  */
 function checkLoggedInAPI(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).end();
  }
 }

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
      context.user_id = user._id;
    }
    return context;
  } else {
    res.redirect(redirectURL);
  }
}