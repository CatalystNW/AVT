const AppProject      = require("../../models/app_project/AppProject"),
      DocumentPackage = require("../../../models/documentPackage");;

const authHelper = require("./AuthHelper");

module.exports.view_index_page = view_index_page;
module.exports.get_upcoming_projects = get_upcoming_projects;
module.exports.project_report = project_report;
module.exports.application_report = application_report;
module.exports.search = search;

async function view_index_page(req, res) {
  const context = authHelper.getUserContext(req, res);
  res.render("app_project/report", context);
}

async function get_upcoming_projects(req, res) {
  let projects = await AppProject.find({status: "upcoming",})
                  .populate({path:"workItems", model: "WorkItem", 
                    populate: {path:"materialsItems", model: "MaterialsItem"}})
                  .populate("partners")
                  .populate("documentPackage");
  res.status(200).json(projects);
}

async function project_report(req, res) {
  let options = {status: "complete"};
  if (req.body.startDate || req.body.endDate) {
    options.start = {};
    if (req.body.startDate) {
      options.start["$gte"] = new Date(req.body.startDate);
    }
    if (req.body.endDate) {
      let endDate = new Date(req.body.endDate);
      endDate.setHours(23, 59, 59, 59);
      options.start["$lte"] = endDate;
    }
  }
  let projects = await AppProject.find(options)
                  .populate({path:"workItems", model: "WorkItem", 
                    populate: {path:"materialsItems", model: "MaterialsItem"}})
                  .populate("partners")
                  .populate("documentPackage");
  res.status(200).json(projects);
}

async function application_report(req, res) {
  let options = {};
  if (req.body.startDate || req.body.endDate) {
    options.created = {};
    if (req.body.startDate) {
      options.created["$gte"] = new Date(req.body.startDate);
    }
    if (req.body.endDate) {
      let endDate = new Date(req.body.endDate);
      endDate.setHours(23, 59, 59, 59);
      options.created["$lte"] = endDate;
    }
  }
  let documents = await DocumentPackage.find(options);
  res.status(200).json(documents);
}

async function search(req, res) {
  let docOptions = {}, searchDoc = false;
  // DocumentPackage name, zip, city
  if (req.body.first_name) {
    docOptions["application.name.first"] = {
      '$regex': req.body.first_name,
      '$options': 'i'
    };
    searchDoc = true;
  }
  if (req.body.last_name) {
    docOptions["application.name.last"] = {
      '$regex': req.body.last_name,
      '$options': 'i'
    };
    searchDoc = true;
  }
  if (req.body.zip) {
    docOptions["application.address.zip"] = {
      '$regex': req.body.zip,
      '$options': 'i'
    };
    searchDoc = true;
  }
  if (req.body.city) {
    docOptions["application.address.city"] = {
      '$regex': req.body.city,
      '$options': 'i'
    };
    searchDoc = true;
  }
  // DocumentPackage /  Application Start Date
  if (req.body.application_start_start || req.body.application_start_end) {
    docOptions.created = {};
    if (req.body.application_start_start) {
      docOptions.created["$gte"] = new Date(req.body.application_start_start);
    }
    if (req.body.application_start_end) {
      let endDate = new Date(req.body.application_start_end);
      endDate.setHours(23, 59, 59, 59);
      docOptions.created["$lte"] = endDate;
    }
    searchDoc = true
  }

  let options = {};
  let docIds;
  if (searchDoc) {
    let documents = await DocumentPackage.find(docOptions);
    docIds = documents.map(document => {
      return document._id;
    });
    options.documentPackage = {$in: docIds};
  }

  if (req.body.project_name) {
    options.name = {
      '$regex': req.body.project_name,
      '$options': 'i'
    };
  }

  if (req.body.project_start_start || req.body.project_start_end) {
    options.start = {};
    if (req.body.project_start_start) {
      options.start["$gte"] = new Date(req.body.project_start_start);
    }
    if (req.body.project_start_end) {
      let endDate = new Date(req.body.project_start_end);
      endDate.setHours(23, 59, 59, 59);
      options.start["$lte"] = endDate;
    }
  }

  if (req.body.project_end_start || req.body.project_end_end) {
    options.end = {};
    if (req.body.project_end_start) {
      options.end["$gte"] = new Date(req.body.project_end_start);
    }
    if (req.body.project_end_end) {
      let endDate = new Date(req.body.project_end_end);
      endDate.setHours(23, 59, 59, 59);
      options.end["$lte"] = endDate;
    }
  }

  if (req.body.site_host || req.body.project_advocate ||
        req.body.crew_chief) {
    
    if (req.body.leaders_option == "or") {
      let leaders_option = [];
      if (req.body.site_host) {
        leaders_option.push({
          "site_host": {
            '$regex': req.body.site_host,
            '$options': 'i'
          }
        });
      }
      if (req.body.crew_chief) {
        leaders_option.push({
          "crew_chief": {
            '$regex': req.body.crew_chief,
            '$options': 'i'
          }
        });
      }
      if (req.body.project_advocate) {
        leaders_option.push({
          "project_advocate": {
            '$regex': req.body.project_advocate,
            '$options': 'i'
          }
        });
      }
      options["$or"] = leaders_option;
    } else {
      if (req.body.site_host) {
        options.site_host = {
          '$regex': req.body.site_host,
          '$options': 'i'
        };
      }
      if (req.body.crew_chief) {
        options.crew_chief = {
          '$regex': req.body.crew_chief,
          '$options': 'i'
        };
      }
      if (req.body.project_advocate) {
        options.project_advocate = {
          '$regex': req.body.project_advocate,
          '$options': 'i'
        };
      }
    }    
  }

  let projects = await AppProject.find(options).populate("documentPackage")
                .populate({path:"workItems", model: "WorkItem", 
                  populate: {path:"materialsItems", model: "MaterialsItem"}});

  res.status(200).json(projects);
}