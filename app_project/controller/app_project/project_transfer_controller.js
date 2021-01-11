var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem");

module.exports.view_project_transfers = view_project_transfers;
module.exports.view_project_transfer = view_project_transfer;
module.exports.transfer_project = transfer_project;

async function view_project_transfers(req, res) {
  var assessments = await SiteAssessment.find({status: "complete",})
                      .populate("documentPackage");
  res.render("app_project/project_transfers", {assessments: assessments,});
}

async function view_project_transfer(req, res) {
  // var assessment = await SiteAssessment.findById(req.params.assessment_id)
  //     .populate("documentPackage")
  //     .populate({path: "workItems", model: "WorkItem", populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.render("app_project/project_transfer", {assessment_id: req.params.assessment_id,});
}

async function transfer_project(req, res) {
  console.log(req.params.assessment_id);
  console.log(req.body.project_workitems);
  console.log(req.body.handleit_workitems);
  var project_workitems = req.body.project_workitems,
      handleit_workitems = req.body.handleit_workitems;
  var i, id,
      ids = [], projects = {};
  for (id in project_workitems) {
    ids.push(id);
    if (project_workitems[id] in projects) {
      projects[project_workitems[id]].push(id);
    } else {
      projects[project_workitems[id]] = [id,];
    }
  }
  console.log(ids);
  
  var workItems = await WorkItem.find().where('_id').in(ids)
        .populate("materialsItems").exec();
  for(i=0; i<workItems.length;i++) {
    console.log(workItems[i]);
  }

  res.status(200).send();
}