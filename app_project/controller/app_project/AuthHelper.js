/**
 * Helper functions to check authentication
 */

 var User = require('../../../models/userPackage');

 module.exports.checkLoggedInPages = checkLoggedInPages;
 module.exports.checkLoggedInAPI = checkLoggedInAPI;
 module.exports.isLoggedIn = isLoggedIn;
 module.exports.getUserContext = getUserContext;
 module.exports.hasRole = hasRole;
 module.exports.canView = canView;
 module.exports.checkIfCanView = checkIfCanView;
 
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

function getUserContext(req, res, redirectURL = "/user/login") {
  if (isLoggedIn(req)) {
    const context = {};
    if (req.user) {
      context.user_email = req.user.contact_info.user_email;
      context.user_roles = req.user.user_roles;
      context.user = true;
      context.user_id = req.user._id.toString();
    }
    return context;
  } else {
    res.redirect(redirectURL);
  }
}

/**
 * Checks if user has the specified role
 * @param {*} req 
 * @param {*} res 
 * @param {String or Array of String} role Single role or multiple roles checked
 * @returns true if user has the role. false if not.
 */
function hasRole(req, res, role) {
  if (isLoggedIn(req)) {
    const context = getUserContext(req, res);
    if (Array.isArray(role))  {
      for (let i = 0; i < role.length; i++) {
        if (context.user_roles.includes(role[i])) {
          return true;
        }
      }
      return false;
    } else {
      return context.user_roles.includes(role);
    }
  } else {
    return false;
  }
}

/**
 * Searches if user has either VET, SITE, or PROJECT_MANAGEMENT role
 * to be able to view a page.
 * @param {*} req 
 * @param {*} res 
 * @returns Boolean if user can view the page
 */
function canView(req, res) {
  return hasRole(req, res, ["VET", "SITE", "PROJECT_MANAGEMENT"]);
}

function checkIfCanView(req, res, next) {
  if (hasRole(req, res, ["VET", "SITE", "PROJECT_MANAGEMENT"])) {
    next();
  } else {
    res.status(403).end();
  }
}