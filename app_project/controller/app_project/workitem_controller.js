var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem"),
    AppProject = require("../../models/app_project/AppProject");

module.exports.create_workitem = create_workitem;
module.exports.edit_workitem = edit_workitem;
module.exports.delete_workitem = delete_workitem;

// Creates WorkItem & saves it to either SiteAssessment
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
  if (req.body.type == "assessment" && req.body.assessment_id) {
    var assessment = await SiteAssessment.findById(req.body.assessment_id);
    if (!assessment) {
      res.status(404).end();
      return;
    }
    if (assessment.transferred) { // Prevent adding workitems for transferred assessments
      res.status(400).end();
      return;
    }
    if (req.body.assessment_comments)
      workitem.assessment_comments = req.body.assessment_comments;
    
    workitem.siteAssessment = assessment._id; 
  } else if (req.body.type == "project" && req.body.project_id) {
    var project = await AppProject.findById(req.body.project_id);
    if (!project) {
      res.status(400).end();
      return;
    }
    workitem.appProject = project._id;
  } else {
    res.status(400).end();
    return;
  }

  workitem.documentPackage = doc._id;
  await workitem.save();
  // Save WorkItem to SiteAssesssment/ AppProject
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
      let workitem = await WorkItem.findById(req.params.workitem_id);
      if (!workitem) {
        res.status(404).end();
        return;
      } else if  (workitem.transferred) {
        // Transferred work items aren't editable
        res.status(400).end();
        return;
      }

      workitem = await WorkItem.findOneAndUpdate({_id: req.params.workitem_id,}, req.body, {new: true})
      res.status(200).json(workitem);
    } catch (err) {
      res.status(400).end();
    }
  }
}

async function delete_workitem(req, res) {
  if (!req.params.workitem_id) {
    res.status(400).end();
  } else {
    const workItem_id = req.params.workitem_id;
    let workitem = await WorkItem.findById(workItem_id),
        i;
    if (workitem) {
      if (workitem.transferred) { // Prevent deletion of transferred workItem
        res.status(400).end();
        return;
      }
      if (workitem.type == "assessment") {
        let siteAssessment = await SiteAssessment.findById(workitem.siteAssessment);
        for (i=0; i<siteAssessment.workItems.length; i++) {
          if (siteAssessment.workItems[i] == workItem_id) {
            siteAssessment.workItems.splice(i, 1);
            break;
          }
        }
        await siteAssessment.save();
      } else if (workitem.type == "project") {
        let appProject = await AppProject.findById(workitem.appProject);
        for (i=0; i<appProject.workItems.length; i++) {
          if (appProject.workItems[i] == workItem_id) {
            appProject.workItems.splice(i, 1);
            break;
          }
        }
        appProject.save();
      }
      await MaterialsItem.deleteMany({workItem: workitem._id});
      await WorkItem.deleteOne({_id: workItem_id}, function(err) {
        if (err) {
          res.status(400).send();
          console.log(err);
        } else {
          res.status(200).send(); 
        }
      });
    } else {
      res.status(404).end();
    }
  }
}