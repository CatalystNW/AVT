const SiteAssessment = require("../../models/app_project/SiteAssessment"),
      WorkItem = require("../../models/app_project/WorkItem"),
      MaterialsItem = require("../../models/app_project/MaterialsItem"),
      AppProject = require("../../models/app_project/AppProject");

const authHelper = require("./AuthHelper");

module.exports.getWorkitemsByAppId = getWorkitemsByAppId;
module.exports.create_workitem = create_workitem;
module.exports.edit_workitem = edit_workitem;
module.exports.delete_workitem = delete_workitem;

async function getWorkitemsByAppId(req, res) {
  const application_id = req.params.application_id
  let workitems = [], i;
  // Search thru project & assessments since workitems themselves don't
  // contain documentPackage
  let projects = await AppProject.find({
      documentPackage: application_id
    }).populate({path: "workItems", model: "WorkItem",
              populate: {path: "materialsItems", model: "MaterialsItem"}});

  projects.forEach(project => {
    for(i=0; i< project.workItems.length; i++) {
      workitems.push(project.workItems[i]);
    }
  });

  let assessments = await SiteAssessment.find({
      documentPackage: application_id,
    }).populate({path: "workItems", model: "WorkItem",
                  populate: {path: "materialsItems", model: "MaterialsItem"}});
  assessments.forEach(project => {
    for(i=0; i< project.workItems.length; i++) {
      workitems.push(project.workItems[i]);
    }
  });
  res.status(200).json(workitems);
}

/**
 * Creates WorkItem & saves it to either SiteAssessment or Project
 * Handleit work items create new project. If assessment_id doesn't exist
 * with type assessment, then search by application id. If that doesn't
 * exists, then a new assessment will be created
 * @param {*} req body: type["assessment", "project"], name, description
 *  project_id or assessment_id (dependent on type)
 * @param {*} res 200 with work item as JSON, 400, 404
 */
async function create_workitem(req, res) {
  // Convert handleit text into boolean
  if (req.body.handleit == 'true' || req.body.handleit == true) {
    req.body.handleit = true;
  } else {
    req.body.handleit = false;
  }
  // handleit might not have a type
  if ((!req.body.handleit && !req.body.type) ||
      !req.body.name || !req.body.description || 
      (!req.body.application_id && !req.body.project_id && !req.body.assessment_id)) {
    res.status(400).end();
    return;
  }

  let workitem = new WorkItem(req.body);

  let assessment, project;
  // handleit work item will create new AppProject directly
  if (req.body.handleit && req.body.application_id) {
    if (!authHelper.canView(req, res)) {
      res.status(403).end(); return;
    }
    project = new AppProject();
    project.name = workitem.name;
    project.documentPackage = req.body.application_id;
    project.handleit = true;
    workitem.type = "project"
    workitem.appProject = project._id;
  } else if (req.body.type == "project" && req.body.project_id) {
    // Check for user role for project
    if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
      res.status(403).end(); return;
    }
    project = await AppProject.findById(req.body.project_id);
    if (!project) {
      res.status(400).end();
      return;
    }
    workitem.type = "project"
    workitem.appProject = project._id;
  } else if (req.body.type == "assessment") {
    // Check for user role for site assessment
    if (!authHelper.hasRole(req, res, "SITE")) {
      res.status(403).end(); return;
    }
    if (req.body.assessment_id) {
      assessment = await SiteAssessment.findById(req.body.assessment_id);
      if (!assessment) {
        res.status(404).end();
        return;
      }
    } else if (req.body.application_id) { // search by application_id
      assessment = await SiteAssessment.find({
        documentPackage: req.body.application_id,
        transferred: false, complete: false
      });
      if (assessment.length == 0) { // create assessment if it doesn't exist
        assessment = await SiteAssessment.create(req.body.application_id);
      } else {
        assessment = assessment[0];
      }
    } else {
      res.status(400).end(); return;
    }
    
    workitem.siteAssessment = assessment._id;
    workitem.type = "assessment"
  } else {
    res.status(400).end();
    return;
  }

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
      }

      workitem = await WorkItem.findOneAndUpdate({_id: req.params.workitem_id,}, req.body, {new: true}).populate("materialsItems");
      res.status(200).json(workitem);
    } catch (err) {
      res.status(400).end();
    }
  }
}

async function delete_workitem(req, res) {
  if (!req.params.workitem_id) {
    res.status(400).end(); return;
  }
  
  const workItem_id = req.params.workitem_id;
  let workitem = await WorkItem.findById(workItem_id),
      i;
  if (workitem) {
    if (workitem.type == "project" || workitem.handleit) {
      if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
        res.status(403).end(); return;
      }

      let appProject = await AppProject.findById(workitem.appProject);
      for (i=0; i<appProject.workItems.length; i++) {
        if (appProject.workItems[i] == workItem_id) {
          appProject.workItems.splice(i, 1);
          break;
        }
      }
      appProject.save();
    } else if (workitem.type == "assessment") {
      if (!authHelper.hasRole(req, res, "SITE")) {
        res.status(403).end(); return;
      }
      let siteAssessment = await SiteAssessment.findById(workitem.siteAssessment);
      for (i=0; i<siteAssessment.workItems.length; i++) {
        if (siteAssessment.workItems[i] == workItem_id) {
          siteAssessment.workItems.splice(i, 1);
          break;
        }
      }
      await siteAssessment.save();
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