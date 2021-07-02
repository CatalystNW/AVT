const DocumentPackage = require("../../../models/documentPackage"),
      SiteAssessment  = require("../../models/app_project/SiteAssessment"),
      WorkItem        = require("../../models/app_project/WorkItem"),
      AppProject      = require("../../models/app_project/AppProject");

const authHelper = require("./AuthHelper");

module.exports.view_project_transfers = view_project_transfers;
module.exports.view_project_transfer = view_project_transfer;
module.exports.transfer_project = transfer_project;

async function view_project_transfers(req, res) {
  if (!authHelper.hasRole(req, res, "SITE")) {
    res.status(403).end(); return;
  }

  const context = authHelper.getUserContext(req, res);
  res.render("app_project/project_transfer/project_transfers", context);
}

async function view_project_transfer(req, res) {
  if (!authHelper.hasRole(req, res, "SITE")) {
    res.status(403).end(); return;
  }

  const context = authHelper.getUserContext(req, res);
  context.assessment_id = req.params.assessment_id;
  // var assessment = await SiteAssessment.findById(req.params.assessment_id)
  //     .populate("documentPackage")
  //     .populate({path: "workItems", model: "WorkItem", populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.render("app_project/project_transfer/project_transfer", context);
}

async function transfer_project(req, res) {
  if (!authHelper.hasRole(req, res, "SITE")) {
    res.status(403).end(); return;
  }
  
  let project_workitems = req.body.project_workitems;
  let new_workItem,
      projects = {}, 
      project, project_name;
  let siteAssessment = await SiteAssessment.markComplete(
    req.params.assessment_id, true);
  if (!siteAssessment) {
    res.status(400).end();
    return;
  }
  const documentPackage = await DocumentPackage.findById(siteAssessment.documentPackage);
  documentPackage.applicationStatus = "transferred";
  await documentPackage.save();
  
  for (let i=0, old_workItem; i < siteAssessment.workItems.length; i++) {
    // Transfer only accepted work items
    if (siteAssessment.workItems[i].status != "accepted") {
      continue;
    }
    old_workItem = siteAssessment.workItems[i];
    new_workItem = await WorkItem.makeCopy(old_workItem);
    project_name = project_workitems[old_workItem._id];

    if (project_name in projects) { // Add Workitem to existing project
      projects[project_name].workItems.push(new_workItem._id);
      project = projects[project_name]
    } else { // Create new AppProject
      project = new AppProject();
      project.name = project_name;
      project.siteAssessment = siteAssessment._id;
      project.documentPackage = siteAssessment.documentPackage._id;

      project.start = siteAssessment.project_start_date;
      project.end = siteAssessment.project_end_date;

      project.porta_potty_required = siteAssessment.porta_potty_required;
      project.waste_required = siteAssessment.waste_required;
      project.porta_potty_cost = siteAssessment.porta_potty_cost;
      project.waste_cost = siteAssessment.waste_cost;

      project.handleit = false;
      
      project.workItems.push(new_workItem._id);

      projects[project_name] = project;
      // Copy partners
      project.partners = [...siteAssessment.partners];
    }
    new_workItem.appProject = project._id;
    new_workItem.save();
  }
  // Save all projects
  for (project_name in projects) {
    await projects[project_name].save()
  }
  res.status(200).send();
}