var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem"),
    CostsItem = require("../../models/app_project/CostsItem");

// module.exports.view_project_transfers = view_project_transfers;
// module.exports.view_project_transfer = view_project_transfer;

// async function view_project_transfers(req, res) {
//   var assessments = await SiteAssessment.find({status: "complete",})
//                       .populate("documentPackage");
//   console.log(assessments);
//   res.render("app_project/project_transfers", {assessments: assessments,});
// }

// async function view_project_transfer(req, res) {
//   // var assessment = await SiteAssessment.findById(req.params.assessment_id)
//   //     .populate("documentPackage")
//   //     .populate({path: "workItems", model: "WorkItem", populate: {path: "materialsItems", model: "MaterialsItem"}});
//   res.render("app_project/project_transfer", {assessment_id: req.params.assessment_id,});
// }