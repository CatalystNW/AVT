var PartnerPackage  = require("../../../models/partnerPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    AppProject      = require("../../models/app_project/AppProject");

module.exports.get_all_partners         = get_all_partners;
module.exports.create_partner           =  create_partner

async function get_all_partners(req, res) {
  var partners = await PartnerPackage.find({});
  res.status(200).json(partners);
}

async function create_partner(req, res) {
  if (req.body.type == "project") {
    var project = await AppProject.findById(req.body.project_id);

    if (!project) {
      res.status(404).end();
      return;
    }
    var partner = new PartnerPackage();
    partner.org_name      = req.body.name;
    partner.org_address   = req.body.address;
    partner.contact_name  = req.body.contact;
    partner.contact_phone = req.body.phone;
    partner.contact_email = req.body.email;
    await partner.save();

    project.partners.push(partner._id);
    res.status(200).json(partner);
  }
  res.status(200).end();
}