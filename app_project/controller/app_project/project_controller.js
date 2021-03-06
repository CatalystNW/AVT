const UserPackage     = require("../../../models/userPackage"),
      AppProject      = require("../../models/app_project/AppProject"),
      PlanChecklist   = require("../../models/app_project/AppProjectPlanChecklist"),
      WrapupChecklist = require("../../models/app_project/ProjectWrapupChecklist");

const authHelper = require("./AuthHelper");

module.exports.get_projects               = get_projects;
module.exports.view_projects              = view_projects;
module.exports.view_project               = view_project;
module.exports.edit_project               = edit_project;
module.exports.get_project                = get_project;
module.exports.get_plan_checklist         = get_plan_checklist;
module.exports.edit_checklist             = edit_checklist
module.exports.create_checklist_item      = create_checklist_item
module.exports.get_task_assignable_users  = get_task_assignable_users;
module.exports.delete_checklist_item      = delete_checklist_item;
module.exports.get_wrapup_checklist       = get_wrapup_checklist;
module.exports.get_work_items             = get_work_items;

module.exports.set_partners               = set_partners;

module.exports.view_paf_page               = view_paf_page;
module.exports.view_handleit_form          = view_handleit_form;


async function view_paf_page(req, res) {
  const context = authHelper.getUserContext(req, res);
  context.type = "project";
  context.project_id = req.params.project_id;

  res.render('app_project/paf_form', context);
}
async function view_handleit_form(req, res) {
  const context = authHelper.getUserContext(req, res);
  context.type = "project";
  context.project_id = req.params.project_id;

  res.render('app_project/handleit_form', context);
}

async function get_projects(req, res) {
  if (!authHelper.hasRole(req, res, ["PROJECT_MANAGEMENT", "VET"])) {
    res.status(403).end(); return;
  }
  var projects = await AppProject.find({}).populate("documentPackage");
    // .populate({path: "workItems", model: "WorkItem",
    //     populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.status(200).json(projects);
}

/**
 * Returns the project data as JSON
 * @param {*} req - req.params.project_id
 * @param {*} res 
 */
async function get_project(req, res) {
  if (!authHelper.hasRole(req, res, ["PROJECT_MANAGEMENT", "VET"])) {
    res.status(403).end(); return;
  }
  var project = await AppProject.findById(req.params.project_id)
      .populate({path: "workItems", model: "WorkItem",
                populate: {path: "materialsItems", model: "MaterialsItem"}})
      .populate("partners").populate("documentPackage").populate("siteAssessment");
  if (project) {
    if (project.start) {
      project.start = project.start.toISOString();
    }
    if (project.end) {
      project.end = project.end.toISOString();
    }
    res.status(200).json(project);
  } else {
    res.status(404).end();
  }
}

async function view_projects(req, res) {
  if (!authHelper.hasRole(req, res, ["PROJECT_MANAGEMENT", "VET"])) {
    res.status(403).end(); return;
  }

  const context = authHelper.getUserContext(req, res);
  res.render("app_project/project/view_projects", context);
}

async function view_project(req, res) {
  if (!authHelper.hasRole(req, res, ["PROJECT_MANAGEMENT", "VET"])) {
    res.status(403).end(); return;
  }

  const context = authHelper.getUserContext(req, res);
  context.project_id = req.params.project_id;
  res.render("app_project/project/view_project", context);
}

async function get_task_assignable_users(req, res) {
  let users = [];
  let userPackages = await UserPackage.find({ assign_tasks: true });
  for (let i=0; i< userPackages.length; i++) {
    users.push({
      name: userPackages[i].contact_info.user_name.user_first + " " + userPackages[i].contact_info.user_name.user_last,
      id: userPackages[i]._id,
    });
  }
  res.status(200).json(users);
}

async function get_plan_checklist(req, res) {
  if (req.params.project_id) {
    var project_id = req.params.project_id;
    
    var checklist = await PlanChecklist.find({project: project_id}).lean();
    if (checklist.length == 0) {
      checklist = new PlanChecklist();
      checklist.project = project_id;
      await checklist.save();
    } else {
      checklist = checklist[0];
    }
    res.status(200).json(checklist);
  } else {
    res.status(404).end();
    return;
  }
}

async function edit_checklist(req, res) {
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }
  
  var property = req.body.property,
      value = req.body.value,
      i;
  var checklist;
  if (req.body.type == "planning") {
    checklist = await PlanChecklist.findById(req.params.checklist_id);
  } else if (req.body.type == "wrapup") {
    checklist = await WrapupChecklist.findById(req.params.checklist_id);
  } else {
    res.status(400).end();
    return;
  }
  if (!checklist) {
    res.status(404).end();
    return;
  }
  // Convert checlist property to true/false depending from string value
  if (req.body.property_type == "property") {
    if (property in checklist) {
      checklist[property].complete = value == "true" ? true : false;
      await checklist.save();
    } else {
      for (i=0;i<checklist.additional_checklist.length; i++) {
        if (checklist.additional_checklist[i].name == property) {
          checklist.additional_checklist[i].complete = value == "true" ? true : false;
          await checklist.save();
          break;
        }
      }
    }
  } else if (req.body.property_type == "owner") {
    var owner = value == "" ? null : value;
    if (property in checklist) {
      checklist[property].owner = owner;
      await checklist.save();  
    } else {
      for (i=0;i<checklist.additional_checklist.length; i++) {
        if (checklist.additional_checklist[i].name == property) {
          checklist.additional_checklist[i].owner = owner;
          await checklist.save();
          break;
        }
      }
    }
  }
  res.status(200).send();
}

async function edit_project(req, res) {
  // User doesn't have project role. Return 403
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }
  var project_id = req.params.project_id;
  var project = await AppProject.findById(project_id).populate("workItems");
  if (!project) {
    res.status(404).end();
    return;
  }
  if (req.body.property == "project_start_date" 
    || req.body.property == "project_end_date") {
    let d;
    // Can accept the date ISO string (toISOString js method) in date_iso_string
    if (req.body.date_iso_string) {
      d = new Date(req.body.date_iso_string);
    } else {
      d = new Date(
        parseInt(req.body.year),
        parseInt(req.body.month),
        parseInt(req.body.day),
        parseInt(req.body.hours),
        parseInt(req.body.minutes),
      ); 
    }
    if (req.body.property == "project_start_date") {
      project.start = d;
    } else {
      project.end = d;
    }
    await project.save();
    res.status(200).send({"date": d});
  } else { // Save property as normal
    // Also look the project and work & materials items
    if (!project.handleit && req.body.property == "status" && req.body.value == "complete" ) {
      // Make sure all work items are complete unless its handleit
      for (let i=0; i < project.workItems.length; i++) {
        if (project.workItems[i].status != "complete") {
          res.status(400).end();
          return;
        }
      }
    }
    if (req.body.property == "status" &&
        (req.body.value == "complete" || req.body.value == "withdrawn")) {
      AppProject.markComplete(project_id);
    }

    if (req.body.property && req.body.value) {
      project[req.body.property] = req.body.value;
      await project.save();
    }        
    res.status(200).send();
  }  
}

async function create_checklist_item(req, res) {
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }

  var name = req.body.name;
  if (name && typeof name == "string" && name.length > 4) {
    var checklist;
    if (req.body.type == "planning") {
      checklist = await PlanChecklist.findById(req.params.checklist_id);
    } else if (req.body.type == "wrapup") {
      checklist = await WrapupChecklist.findById(req.params.checklist_id);
    } else {
      res.status(400).end();
      return;
    }
    
    if (checklist) {
      // Check that the item doesn't already exists with same name
      for (let i=0; i<checklist.additional_checklist.length; i++) {
        if (checklist.additional_checklist.name == name) {
          res.status(409).end();
          return;
        }
      }
      checklist.additional_checklist.push({
        name: name,
      });
      await checklist.save();
      res.status(200).json(
        checklist.additional_checklist[checklist.additional_checklist.length -1]
      );
    } else {
      res.status(404).end();
    }
  } else {
    res.status(400).send("Error in data given");
  } 
}

async function delete_checklist_item(req, res) {
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }

  var name = req.body.name;
  if (name && typeof name == "string") {
    var checklist;
    if (req.body.type == "planning") {
      checklist = await PlanChecklist.findById(req.params.checklist_id);
    } else if (req.body.type == "wrapup") {
      checklist = await WrapupChecklist.findById(req.params.checklist_id);
    } else {
      res.status(400).end();
      return;
    }
    if (checklist) {
      // Check that the item doesn't already exists with same name
      for (let i=0; i<checklist.additional_checklist.length; i++) {
        if (checklist.additional_checklist[i].name == name) {
          checklist.additional_checklist.splice(i, 1);
          await checklist.save();
          res.status(200).send();
          return;
        }
      }
      res.status(404).send("Item in checklist not found");
    } else {
      res.status(404).end();
    }
  } else {
    res.status(400).send("Error in data given");
  }
}

async function get_wrapup_checklist(req, res) {
  if (req.params.project_id) {
    var project_id = req.params.project_id;
    
    var checklist = await WrapupChecklist.find({project: project_id}).lean();
    if (checklist.length == 0) {
      checklist = new WrapupChecklist();
      checklist.project = project_id;
      await checklist.save();
    } else {
      checklist = checklist[0];
    }
    res.status(200).json(checklist);
  } else {
    res.status(404).end();
    return;
  }
}

async function get_work_items(req, res) {
  if (!authHelper.hasRole(req, res, ["PROJECT_MANAGEMENT", "VET"])) {
    res.status(403).end(); return;
  }
  var project_id = req.params.project_id;

  var project = await AppProject.findById(project_id).populate({path: "workItems", model: "WorkItem",
        populate: {path: "materialsItems", model: "MaterialsItem"}});
  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).send();
    return;
  }
}

async function set_partners(req, res) {
  // User doesn't have project role. Return 403
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }
  const project_id = req.params.project_id;
  const project = await AppProject.findById(project_id);
  if (project) {
    let new_partners = req.body["selectedPartnerIds[]"]
    project.partners = new_partners;
    project.save();
    res.status(200).end();
  } else {
    res.status(404).end();
  }
  
}