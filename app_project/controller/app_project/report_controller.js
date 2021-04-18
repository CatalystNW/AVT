const authHelper = require("./AuthHelper");

module.exports.view_index_page = view_index_page;

async function view_index_page(req, res) {
  res.render("app_project/report", {});
}