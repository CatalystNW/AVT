var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject");

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
  var i, j, id, copyObj,
      ids = [], old_workItem, new_workItem,
      projects = {}, project;
  var siteAssessment = await SiteAssessment.findById("4124124");
  
  for (id in project_workitems) {
    ids.push(id);
    old_workItem = await (await WorkItem.findById(id))
      .populated("materialsItems").exec();
    new_workItem = await WorkItem.makeCopy(old_workItem);

    if (project_workitems[id] in projects) {
      projects[project_workitems[id]].workItems.push(new_workItem._id);
    } else {
      project = new AppProject();
      project.name = project_workitems[id];
      project.siteAssessment = siteAssessment._id;
      project.documentPackage = siteAssessment.documentPackage;
      project.handleit = false;
      
      projects.workitems.push(new_workItem);
      
      // await projects.save()

      projects[project_workitems[id]] = project;
    }
  }
  
  // var workItems = await WorkItem.find().where('_id').in(ids)
  //       .populate("materialsItems").exec();
  // for(i=0; i<workItems.length; i++) {
  //   console.log(WorkItem.makeCopy(workItems[i]) );
  //   for (j=0; j<workItems[i].materialsItems.length; j++) {
  //     console.log(j);
  //   }
  // }

  res.status(200).send();
}