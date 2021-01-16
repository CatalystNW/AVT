var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem"),
    AppProject = require("../../models/app_project/AppProject");

module.exports.create_workitem = create_workitem;
module.exports.edit_workitem = edit_workitem;
module.exports.delete_workitem = delete_workitem;

async function create_workitem(req, res) {  
  if (!req.body.type || !req.body.name || !req.body.description || 
    !req.body.application_id || (!req.body.project_id && !req.body.assessment_id)) {
    res.status(400).end();
    return;
  }
  var doc = await DocumentPackage.findById(req.body.application_id);
  if (!doc) {
    res.status(400).send("Document ID not found");
    return;
  }
  
  var workitem = new WorkItem();
  workitem.name = req.body.name;
  workitem.description = req.body.description;
  workitem.type = req.body.type;
  workitem.documentPackage = doc.id;
  workitem.handleit = req.body.handleit;
  if (req.body.type == "assessment") {
    var assessment;
    if (!req.body.assessment_id) {
      res.status(400).end();
      return;
    }
    assessment = await SiteAssessment.findById(req.body.assessment_id);
    if (!assessment) {
      res.status(400).end();
      return;
    }

    if (req.body.assessment_comments)
      workitem.assessment_comments = req.body.assessment_comments;
    
    workitem.siteAssessment = assessment; 
  } else if (req.body.type == "project") {
    if (!req.body.project_id) {
      res.status(400).end();
      return;
    }
    var project = await AppProject.findById(req.body.project_id);
  } else {
    res.status(400).end();
    return;
  }
  workitem.documentPackage = doc._id;
  await workitem.save();

  if (assessment) {
    assessment.workItems.push(workitem.id);
    await assessment.save();
  } else if (project) {
    project.workItems.push(workitem._id);
    await project.save();
  }  
  res.status(200).json(workitem);
}

async function edit_workitem(req, res)  {
  if (!req.params.workitem_id) {
    res.status(400).end();
  } else {
    try {
      var workitem = await WorkItem.findOneAndUpdate({_id: req.params.workitem_id,}, req.body, {new: true})
      console.log(workitem);
      res.status(200).json(workitem);
    } catch (err) {
      console.log(err);
      res.status(400).end();
    }
  }
}

async function delete_workitem(req, res) {
  if (!req.params.workitem_id) {
    res.status(400).end();
  } else {
    console.log(req.params.workitem_id);
    await WorkItem.deleteOne({_id: req.params.workitem_id}, function(err) {
      if (err) {
        res.status(400).send();
        console.log(err);
      } else {
        res.status(200).send(); 
      }
    });
  }
}