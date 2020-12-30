var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem"),
    CostsItem = require("../../models/app_project/CostsItem");

module.exports.view_projects_page = view_projects_page;
module.exports.view_site_assessments = view_site_assessments;
module.exports.view_site_assessment = view_site_assessment;
module.exports.get_site_assessment = get_site_assessment;
module.exports.edit_site_assessment = edit_site_assessment;

module.exports.create_costsitem = create_costsitem;
module.exports.delete_costsitem = delete_costsitem;
module.exports.edit_costsitem = edit_costsitem;

module.exports.get_application_data_api = get_application_data_api;

module.exports.view_delete_manager = view_delete_manager;
module.exports.manage_deletion = manage_deletion;

module.exports.create_workitem = create_workitem;
module.exports.edit_workitem = edit_workitem;
module.exports.delete_workitem = delete_workitem;

module.exports.create_materialsitem = create_materialsitem;
module.exports.delete_materialsitem = delete_materialsitem;
module.exports.edit_materialsitem = edit_materialsitem;

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
    await WorkItem.deleteMany({});
    await SiteAssessment.deleteMany({});
    await MaterialsItem.deleteMany({});
    await CostsItem.deleteMany({});
    res.status(200).json({});
  }
}

async function get_site_assessment(req, res) {
  var app_id = req.params.application_id;

  // Make sure app_id is valid
  var doc = await DocumentPackage.findById(app_id);

  if (doc) {
    var site_assessment = await SiteAssessment.find({application_id: app_id})
        .populate({path:"workItems", model: "WorkItem", populate: {path:"materialsItems", model: "MaterialsItem"}})
        .populate("costsItems").populate("documentPackage").exec();
    if (!site_assessment || site_assessment.length == 0) {
      // The other fields won't exist at creation
      site_assessment = await SiteAssessment.create(app_id);
    } else {
      site_assessment = site_assessment[0];
    }
    res.status(200).json({site_assessment: site_assessment});
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
  if (!req.params.workitem_id) {
    res.status(400).end();
  } else {
    try {
      var workitem = await WorkItem.findOneAndUpdate({_id: req.params.workitem_id,}, req.body, {new: true})
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

async function create_costsitem(req, res) {
  if (req.params.assessment_id) {
    var site_assessment = await SiteAssessment.findById(req.body.assessment_id);

    var costItem = new CostsItem({
      price: req.body.price,
      vendor: req.body.vendor,
      description: req.body.description,
      siteAssessment: site_assessment,
    });
    await costItem.save();

    site_assessment.costsItems.push(costItem);
    await site_assessment.save();
    res.status(200).json(costItem);
  } else {
    res.status(400).end();
  }
}

async function delete_costsitem(req, res) {
  if ( req.params.costsitem_id) {
    var costsItem = await CostsItem.findById(req.params.costsitem_id);

    var site_assessment = await SiteAssessment.findById(costsItem.siteAssessment);
    site_assessment.costsItems.pull({_id: req.params.costsitem_id});
    await site_assessment.save();

    await CostsItem.deleteOne({_id: req.param.costsitem_id});
    res.status(200).send();
  } else {
    res.status(400).end();
  }
}

async function edit_costsitem(req, res) {
  if (req.params.costsitem_id) {
    var item = await CostsItem.findOneAndUpdate(
      {_id: req.params.costsitem_id}, req.body, {new: true});
    
    res.status(200).json(item);
  } else {
    res.status(400).end();
  }
  
}

async function create_materialsitem(req, res) {
  if (!req.body.workitem_id)
    res.status(400).end();
  var workitem = await WorkItem.findById(req.body.workitem_id);
  if (!workitem)
    res.status(400).end();
  var item = new MaterialsItem();
  item.description = req.body.description;
  item.quantity = req.body.quantity;
  item.price = req.body.price;
  item.vendor = req.body.vendor;
  item.workItem = workitem;
  item.cost = item.quantity * item.price;
  await item.save();

  workitem.materialsItems.push(item);
  workitem.materials_cost += item.cost;
  await workitem.save();
  res.status(200).json(item);
}

async function delete_materialsitem(req, res) {
  var item = await MaterialsItem.findById(req.params.id);

  var workitem = await WorkItem.findById(item.workItem);
  workitem.materials_cost -= item.cost;
  workitem.materialsItems.pull({_id: item._id});
  await workitem.save();

  await MaterialsItem.deleteOne({_id:req.params.id});
  res.status(200).send();
}

// New cost is included into req.body.cost
async function edit_materialsitem(req, res) {
  var item = await MaterialsItem.findById(req.params.id);
  if (!item)
    res.status(404).end();
  var old_cost = item.cost;
  item = await MaterialsItem.findOneAndUpdate({_id: req.params.id}, req.body, {new: true,});

  var workitem = await WorkItem.findById(item.workItem);
  workitem.total -= old_cost;
  workitem.total += item.cost;
  await workitem.save();
  res.status(200).json(item);
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