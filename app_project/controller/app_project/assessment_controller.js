var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem");

module.exports.view_site_assessments = view_site_assessments;
module.exports.view_site_assessment = view_site_assessment;
module.exports.view_site_assessment_by_app_id = view_site_assessment_by_app_id;
module.exports.get_site_assessment = get_site_assessment;
module.exports.edit_site_assessment = edit_site_assessment;

module.exports.getApplicationsInAssessment = getApplicationsInAssessment;

module.exports.get_application_data_api = get_application_data_api;

module.exports.view_delete_manager = view_delete_manager;
module.exports.manage_deletion = manage_deletion;

module.exports.set_partners = set_partners;


async function view_site_assessments(req, res) {
  res.render("app_project/site_assessments");
}

// Returns all documentPackages are at the siteAssessment stage / status
async function getApplicationsInAssessment(req, res) {
  // I don't know what level is used for, but api.getDocumentSTatusSite filtered out level 5
  var docPacks = await DocumentPackage.find().or([{status: "assess"}, {status: "assessComp"}]).where('level').ne(5).exec();
  var documents = [],
      docs;
  for (var i=0;i < docPacks.length; i++) {
    documents.push({
      status: docPacks[i].status,
      app_name: docPacks[i].app_name,
      id: docPacks[i].id,
      name: docPacks[i].application.name,
      address: docPacks[i].application.address,
    });
  }
  res.status(200).json({documents: documents,});
}

async function view_site_assessment_by_app_id(req, res) {
  var app_id = req.params.application_id;
  let siteAssessment = await getOrCreateAssessmentByAppId(app_id);
  res.render("app_project/site_assessment", {assessment_id: siteAssessment._id,});
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
    await WorkItem.deleteMany({});
    await SiteAssessment.deleteMany({});
    await MaterialsItem.deleteMany({});
    res.status(200).json({});
  }
}

/**
 * Gets a site assessment with transferred: false and app_id. If it
 * doesn't, exist, then it will create one.
 * @param {*} app_id 
 * Returns: siteAssessment(no population) or null if documentPackage doesn't exist.
 */
async function getOrCreateAssessmentByAppId(app_id) {
  // Make sure app_id is valid
  var doc = await DocumentPackage.findById(app_id);

  if (doc) {
    var site_assessment = await SiteAssessment.find({application_id: app_id, transferred: false});
    if (site_assessment.length == 0) {
      // The other fields won't exist at creation
      site_assessment = await SiteAssessment.create(app_id);
    } else {
      site_assessment = site_assessment[0];
    }
    return site_assessment;
  } else {
    return null;
  }
}

async function get_site_assessment(req, res) {
  var assessment_id = req.params.assessment_id;
  var site_assessment = await SiteAssessment.findById(assessment_id)
      .populate({path:"workItems", model: "WorkItem", populate: {path:"materialsItems", model: "MaterialsItem"}})
      .populate("documentPackage").populate("partners").exec();
  if (site_assessment) {
    res.status(200).json(site_assessment);
  } else {
    res.status(404).end();
  }
}

async function edit_site_assessment(req, res) {
  var property = req.body.property,
      assessment_id = req.body.assessment_id;
  var site_assessment = await SiteAssessment.findById(assessment_id);
  if (property == "project_start_date" || property == "project_end_date") {
    var d = new Date(
      parseInt(req.body.year),
      parseInt(req.body.month)-1,
      parseInt(req.body.day),
      parseInt(req.body.hours),
      parseInt(req.body.minutes),
    );
    if (property == "project_start_date") {
      site_assessment.project_start_date = d;
    } else {
      site_assessment.project_end_date = d;
    }
    await site_assessment.save();
    res.status(200).send({"date": d,});
  } else if (property == "status") {
    // Change status both in DocumentPackage & Site Assessment
    var doc = await DocumentPackage.findById(site_assessment.application_id);
    if (req.body.value == "pending") {
      doc.status = "assess";
    } else if (req.body.value == "complete") {
      doc.status = "assessComp";
    } else {
      res.status(400).send("Wrong parameter field for status given");
      return;
    }
    site_assessment[property] = req.body.value;
    await site_assessment.save();
    await doc.save();
    res.status(200).end();
  } else if (property in site_assessment) {
    if (req.body.value) {
      site_assessment[property] = req.body.value;
      await site_assessment.save();
    }
    res.status(200).end();
  } else {
    res.status(400).end();
  }
}

async function set_partners(req, res) {
  const assessment_id = req.params.assessment_id;
  const assessment = await SiteAssessment.findById(assessment_id);
  if (assessment) {
    let new_partners = req.body["selectedPartnerIds[]"]
    assessment.partners = new_partners;
    assessment.save();
    res.status(200).end();
  } else {
    res.status(404).end();
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