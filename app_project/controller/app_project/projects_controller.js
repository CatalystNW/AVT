const { get } = require("jquery");
var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    ToolsItem = require("../../models/app_project/ToolsItem");

module.exports.view_projects_page = view_projects_page;
module.exports.view_site_assessments = view_site_assessments;
module.exports.view_site_assessment = view_site_assessment;
module.exports.get_site_assessment = get_site_assessment;
module.exports.get_application_data_api = get_application_data_api;

module.exports.view_delete_manager = view_delete_manager;
module.exports.manage_deletion = manage_deletion;

module.exports.create_workitem = create_workitem;
module.exports.edit_workitem = edit_workitem;

async function view_projects_page(req, res) {
  res.render("app_project/projects_page", {});
}

async function view_site_assessments(req, res) {
  // I don't know what level is used for, but api.getDocumentSTatusSite filtered out level 5
  var docPacks = await DocumentPackage.find().or([{status: "assess"}, {status: "assessComp"}]).where('level').ne(5).exec();
  var complete = [],
      pending = [],
      docs;
  for (var i=0;i < docPacks.length; i++) {
    if (docPacks[i].status == "assess") {
      docs = pending;
    } else {
      docs = complete
    }
    docs.push({
      app_name: docPacks[i].app_name,
      id: docPacks[i].id,
      name: docPacks[i].application.name,
      address: docPacks[i].application.address,
    });
  }
  res.render("app_project/site_assessments", { pending: pending, complete: complete });
}

async function view_site_assessment(req, res) {
  var id = req.params.application_id;
  res.render("app_project/site_assessment", {app_id: id,});
}

async function view_delete_manager(req, res) {
  res.render("app_project/delete_manager", {});
}

async function manage_deletion(req, res) {
  var command = req.query.command;

  if (command == "delete_all_assessments") {
    console.log("delete all site assessments");
    res.status(200).json({});
  }
}

async function get_site_assessment(req, res) {
  var app_id = req.params.application_id;

  // Make sure app_id is valid
  var doc = await DocumentPackage.findById(app_id);

  if (doc) {
    var site_assessment = await SiteAssessment.find({application_id: app_id})
        .populate("workItems").populate("toolItems").populate("documentPackage").exec();
    if (site_assessment.length == 0) {
      // The other fields won't exist at creation
      site_assessment = await SiteAssessment.create(app_id);
    }
    // while (site_assessment[0].workItems.length > 0)
    //   site_assessment[0].workItems.pop();
    // await site_assessment[0].save()
    // await WorkItem.deleteMany({});
    res.status(200).json({site_assessment: site_assessment[0]});
  } else {
    res.status(404).end();
  }
  
}

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
  workitem.documentPackage = doc;
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
    assessment.workItems.push(workitem);
    await assessment.save();
  }
  workitem.documentPackage = doc._id;
  res.status(200).json(workitem);
}

async function edit_workitem(req, res)  {
  if (!req.body.workitem_id) {
    res.status(400).end();
  }
  var workitem = await WorkItem.findById(req.body.workitem_id);
  if (req.body.property == "handleit") {
    workitem.handleit = (workitem.handleit) ? false : true;
    workitem.save();
    res.status(200).json({handleit: workitem.handleit});
  }
}

// Manually pulling information to protect transmission of sensitive info
// and have this layer interact with any changes in documentPackage rather than
// frontend portion. 
async function get_application_data_api(req, res){
  var id = req.params.application_id;

  var doc = await DocumentPackage.findById(id);

  var appData = {
    id: doc.id,
    app_name: doc.app_name,
    first_name: doc.application.name.first,
    last_name: doc.application.name.last,
    middle_name: doc.application.name.middle,
    preferred: doc.application.name.preferred,
    phone: doc.application.phone.preferred,
    email: doc.application.email,
    other_phone: doc.application.phone.other,
    dob: {
      year: doc.application.dob.date.getFullYear(),
      month: doc.application.dob.date.getMonth(),
      date: doc.application.dob.date.getDate(),
    },
    line_1: doc.application.address.line_1,
    line_2: doc.application.address.line_2,
    city: doc.application.address.city,
    state: doc.application.address.state,
    zip: doc.application.address.zip,

    emergency_name: doc.application.emergency_contact.name,
    emergency_relationship: doc.application.emergency_contact.relationship,
    emergency_phone: doc.application.emergency_contact.phone,

    spouse: doc.application.spouse,

    other_residents_names: doc.application.other_residents.name,
    other_residents_age: doc.application.other_residents.age,
    other_residents_relationship: doc.application.other_residents.relationship,

    language: doc.application.language,

    owns_home: doc.application.owns_home,

    home_type: doc.property.home_type,
    ownership_length: doc.property.ownership_length,
    year_constructed: doc.property.year_constructed,

    client_can_contribute: doc.property.client_can_contribute.value,
    client_can_contribute_description: doc.property.client_can_contribute.description,

    associates_can_contribute: doc.property.associates_can_contribute.value,
    associates_can_contribute_description: doc.property.associates_can_contribute.description,

    requested_repairs : doc.property.requested_repairs,

    vetting_summary: doc.notes.vet_summary,
    heard_about: doc.application.heard_about,
  };

  res.status(200).json(appData);
}