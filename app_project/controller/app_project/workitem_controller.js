var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem");

module.exports.create_workitem = create_workitem;
module.exports.edit_workitem = edit_workitem;
module.exports.delete_workitem = delete_workitem;

async function create_workitem(req, res) { 
  var r = req.body;
  
  if (!r.type || !r.name || !r.description || !r.application_id)
    res.status(400).end();
  var doc = await DocumentPackage.findById(r.application_id);
  if (!doc)
    res.status(400).end();
  
  var workitem = new WorkItem();
  workitem.name = r.name;
  workitem.description = r.description;
  workitem.type = r.type;
  workitem.documentPackage = doc.id;
  workitem.handleit = r.handleit;
  var assessment;
  if (r.type == "assessment") {
    assessment = await SiteAssessment.findById(r.assessment_id);
    if (!assessment) {
      res.status(400).end();
    }

    if (r.assessment_comments)
      workitem.assessment_comments = r.assessment_comments;
    if (! r.assessment_id)
      res.status(400).end();

    workitem.siteAssessment = assessment;
    
  } else if (r.type == "project") {
    if (r.project_comments) {
      workitem.project_comments = r.project_comments;
    }
  } else {
    res.status(400).end();
  }
  
  await workitem.save();

  if (r.type == "assessment" && assessment) {
    assessment.workItems.push(workitem.id);
    await assessment.save();
  }
  workitem.documentPackage = doc._id;
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