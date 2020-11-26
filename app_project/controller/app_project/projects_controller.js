module.exports.view_projects_page = view_projects_page;

async function view_projects_page(req, res) {
  res.render("app_project/projects_page", {});
}