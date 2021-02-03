var PartnerPackage  = require("../../../models/partnerPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    AppProject      = require("../../models/app_project/AppProject");

module.exports.get_all_partners           = get_all_partners;

async function get_all_partners(req, res) {
  var partners = await PartnerPackage.find({});
  res.status(200).json(partners);
}