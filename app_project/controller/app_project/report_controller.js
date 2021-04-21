const UserPackage     = require("../../../models/userPackage"),
      AppProject      = require("../../models/app_project/AppProject"),
      PlanChecklist   = require("../../models/app_project/AppProjectPlanChecklist"),
      WrapupChecklist = require("../../models/app_project/ProjectWrapupChecklist");

const authHelper = require("./AuthHelper");

module.exports.view_index_page = view_index_page;
module.exports.get_upcoming_projects = get_upcoming_projects;
module.exports.search_project = search_project;

async function view_index_page(req, res) {
  res.render("app_project/report", {});
}

async function get_upcoming_projects(req, res) {
  let projects = await AppProject.find({status: "upcoming",})
                  .populate({path:"workItems", model: "WorkItem", 
                    populate: {path:"materialsItems", model: "MaterialsItem"}})
                  .populate("partners")
                  .populate("documentPackage");
  res.status(200).json(projects);
}

async function search_project(req, res) {
  let options = {status: "complete"};
  if (req.body.startDate || req.body.endDate) {
    options.start = {};
    if (req.body.startDate) {
      options.start["$gte"] = new Date(req.body.startDate);
    }
    if (req.body.endDate) {
      let endDate = new Date(req.body.endDate);
      endDate.setHours(23, 59, 59, 59);
      options.start["$lte"] = endDate;
    }
  }
  let projects = await AppProject.find(options)
                  .populate({path:"workItems", model: "WorkItem", 
                    populate: {path:"materialsItems", model: "MaterialsItem"}})
                  .populate("partners");
  res.status(200).json(projects);
}