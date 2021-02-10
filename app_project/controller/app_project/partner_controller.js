var PartnerPackage  = require("../../../models/partnerPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    AppProject      = require("../../models/app_project/AppProject");

module.exports.get_all_partners         = get_all_partners;
module.exports.create_partner           = create_partner;
module.exports.edit_partner             = edit_partner;
module.exports.delete_partner           = delete_partner;

async function get_all_partners(req, res) {
  var partners = await PartnerPackage.find({});
  res.status(200).json(partners);
}

async function create_partner(req, res) {
  var partner = new PartnerPackage();
  partner.org_name      = req.body.name;
  partner.org_address   = req.body.address;
  partner.contact_name  = req.body.contact;
  partner.contact_phone = req.body.phone;
  partner.contact_email = req.body.email;
  await partner.save();
  res.status(200).json(partner);
}

async function edit_partner(req, res) {
  var partner = await PartnerPackage.findById(req.params.partner_id);
  partner.org_name      = req.body.name;
  partner.org_address   = req.body.address;
  partner.contact_name  = req.body.contact;
  partner.contact_phone = req.body.phone;
  partner.contact_email = req.body.email;
  await partner.save();
  res.status(200).json(partner);
}

async function delete_partner(req, res) {
  const partner_id = req.params.partner_id;
  const projects = await AppProject.find({partners: {_id: partner_id}}),
        assessments = await SiteAssessment.find({partners: {_id: partner_id}});

  // First remove any traces of the partner in AppProject.partners
  let j, i;
  for(i=0; i<projects.length; i++) {
    for (j=0; j<projects[i].partners.length; j++) {
      if (projects[i].partners[j]._id == partner_id ||
            projects[i].partners[j] == partner_id) {
        projects[i].partners.splice(j, 1);
        await projects[i].save();
        break;
      }
    }
  }
  // Also remove from asssessments
  for(i=0; i<assessments.length; i++) {
    for (j=0; j<assessments[i].partners.length; j++) {
      if (assessments[i].partners[j]._id == partner_id ||
            assessments[i].partners[j] == partner_id) {
        assessments[i].partners.splice(j, 1);
        await assessments[i].save();
        break;
      }
    }
  }

  await PartnerPackage.deleteOne({_id: partner_id});
  res.status(200).end();
}