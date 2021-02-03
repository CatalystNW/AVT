var DocumentPackage = require("../../../models/documentPackage"),
    PartnerPackage  = require("../../../models/partnerPackage"),
    UserPackage     = require("../../../models/userPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject"),
    PlanChecklist   = require("../../models/app_project/AppProjectPlanChecklist"),
    WrapupChecklist = require("../../models/app_project/ProjectWrapupChecklist");


module.exports.get_projects               = get_projects;
module.exports.view_projects              = view_projects;
module.exports.delete_all_projects        = delete_all_projects;
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

async function get_projects(req, res) {
  var projects = await AppProject.find({})
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
  var project = await AppProject.findById(req.params.project_id)
      .populate({path: "workItems", model: "WorkItem",
                populate: {path: "materialsItems", model: "MaterialsItem"}})
      .populate("partners");
  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).end();
  }
}

async function view_projects(req, res) {
  res.render("app_project/view_projects", {});
}

async function view_project(req, res) {
  res.render("app_project/view_project", {project_id: req.params.project_id});
}

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
  var project_id = req.params.project_id;
  var project = await AppProject.findById(project_id);
  if (project) {
    if (req.body.property == "project_start_date" 
      || req.body.property == "project_end_date") {
      var d = new Date(
        parseInt(req.body.year),
        parseInt(req.body.month)-1,
        parseInt(req.body.day),
        parseInt(req.body.hours),
        parseInt(req.body.minutes),
      );
      if (req.body.property == "project_start_date") {
        project.start = d;
      } else {
        project.end = d;
      }
      await project.save();
      res.status(200).send({"date": d});
    } else if (req.body.property == "volunteer_hours" ||
        req.body.property == "crew_chief" ||
        req.body.property == "project_advocate" ||
        req.body.property == "site_host") {
      project[req.body.property] = req.body.value;
      await project.save();
      res.status(200).send({"volunteer_hours": req.body.value});
    }
  } else {
    res.status(404).end();
  }
  
}

async function create_checklist_item(req, res) {
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
    console.log(project_id);
    
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