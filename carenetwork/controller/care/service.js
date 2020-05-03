var CareService = require('../../models/care/careService');
var CareApplicant = require('../../models/care/careApplicant');
var UserPackage = require('../../../models/userPackage');

async function get_services(applicant_id) {
  var result = await CareService.find({applicant: applicant_id}).lean().exec();
  return result;
}

async function get_services_by_user(user_id) {
  // var result = await CareService.find({applicant: user_id}).lean().exec();
  var result = await CareService.find({}).lean().exec();
  return result;
}

// Get Service Data only
async function get_service(service_id) {
  var result = await CareService.findById(service_id).exec();
  return result;
}

async function create_service(applicant_id, data) {
  var service = new CareService();
  service.applicant = applicant_id;
  service.volunteer = data.volunteer;
  service.service_date = data.service_date;
  service.note = data.note;
  await service.save();

  var applicant = await CareApplicant.findById(applicant_id).exec();
  applicant.services.push(service._id);
  await applicant.save();

  return true;
}

async function get_workers() {
  var workers = await UserPackage.find({}).lean().exec();

  var data = workers.map(function(service_object) {
    var obj = {};
    obj.id = service_object._id;
    obj._id = service_object._id;
    obj.email = service_object.contact_info.user_email;
    obj.name = service_object.contact_info.user_name.user_first;
    if (service_object.contact_info.user_name.user_middle) {
      obj.name += " " + service_object.contact_info.user_name.user_middle;
    }
    obj.name += " " + service_object.contact_info.user_name.user_last;

    return obj;
  });
  
  return data;
}

module.exports.get_services = get_services;
module.exports.create_service = create_service;
module.exports.get_workers = get_workers;
module.exports.get_service = get_service;
module.exports.get_services_by_user = get_services_by_user