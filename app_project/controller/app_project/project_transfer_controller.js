var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject");

module.exports.view_project_transfers = view_project_transfers;
module.exports.view_project_transfer = view_project_transfer;
module.exports.transfer_project = transfer_project;

async function view_project_transfers(req, res) {
  res.render("app_project/project_transfers");
}

async function view_project_transfer(req, res) {
  // var assessment = await SiteAssessment.findById(req.params.assessment_id)
  //     .populate("documentPackage")
  //     .populate({path: "workItems", model: "WorkItem", populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.render("app_project/project_transfer", {assessment_id: req.params.assessment_id,});
}

async function transfer_project(req, res) {
  let project_workitems = req.body.project_workitems;
  let id, old_workItem, new_workItem,
      projects = {}, 
      project, project_name;
  let siteAssessment = await SiteAssessment.findById(req.params.assessment_id).populate("documentPackage");
  if (siteAssessment.status != "project_approved") {
    res.status(400).end();
    return;
  }
  siteAssessment.transferred = true;
  siteAssessment.documentPackage.status = "transferred";
  
  await siteAssessment.documentPackage.save()
  await siteAssessment.save();
  
  // Create Non-handleit Projects
  for (id in project_workitems) {
    old_workItem = await  WorkItem.findById(id)
      .populate("materialsItems").exec();
    new_workItem = await WorkItem.makeCopy(old_workItem);

    project_name = project_workitems[id]

    if (project_name in projects) { // Add Workitem to existing project
      projects[project_name].workItems.push(new_workItem._id);
      project = projects[project_name]
    } else { // Create new AppProject
      project = new AppProject();
      project.name = project_workitems[id];
      project.siteAssessment = siteAssessment._id;
      project.documentPackage = siteAssessment.documentPackage._id;

      project.start = siteAssessment.project_start_date;
      project.end = siteAssessment.project_end_date;

      project.handleit = false;
      
      project.workItems.push(new_workItem._id);

      projects[project_name] = project;
    }
    old_workItem.transferred = true;
    old_workItem.complete = true;
    old_workItem.save();

    new_workItem.appProject = project._id;
    new_workItem.save();
  }

  for (project_name in projects) {
    await projects[project_name].save()
  }

  // Make non-accepted workItems in SiteAssessment as transferred
  let workItems = await WorkItem.find({
    type: "assessment",
    siteAssessment: siteAssessment._id,
    transferred: false,
  });
  for (let i=0; i<workItems.length; i++) {
    workItems[i].transferred = true;
    workItems[i].complete = true;
    await workItems[i].save();
  }
  res.status(200).send();
}