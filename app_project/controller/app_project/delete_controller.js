var DocumentPackage = require("../../../models/documentPackage"),
    PartnerPackage  = require("../../../models/partnerPackage"),
    UserPackage     = require("../../../models/userPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject"),
    PlanChecklist   = require("../../models/app_project/AppProjectPlanChecklist"),
    WrapupChecklist = require("../../models/app_project/ProjectWrapupChecklist");
module.exports.delete_all_projects = delete_all_projects;

async function delete_all_projects(req, res) {
  var projects = await AppProject.find({})
      .populate({path: "workItems", model: "WorkItem",
        populate: {path: "materialsItems", model: "MaterialsItem"}});
  for (var project of projects) {
    for (var workItem of project.workItems) {
      await MaterialsItem.deleteMany({workItem: workItem._id});
    }
    await WorkItem.deleteMany({appProject: project._id});
  }
  await AppProject.deleteMany({});
  await PlanChecklist.deleteMany({});
  await WrapupChecklist.deleteMany({});
  res.status(200).end();
}
