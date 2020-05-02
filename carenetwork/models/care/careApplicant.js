const mongoose = require('mongoose');

const careApplicantSchema = new mongoose.Schema({
  application_status: {
    type: String,
    default: "never_contacted",
    enum: [
      "to_be_contacted", "assigned_caller", "help_requested", 
      "contact_complete", "never_contacted", "completed"],
  },
  application: {
    first_name: String,
    middle_name: String,
    last_name: String,
    email: String,
    phone: String,

    dob: Date,

    marital_status: String,

    address: {
      line_1: String,
      line_2: String,
      city: String,
      state: String,
      zip: String,
    },

    contact_name: String,
    contact_relationship: String,
    contact_phone: String,
    contact_email: String,

    // contacts: [{
    //   type: mongoose.ObjectId,
    //   ref: "careContact",
    // }],

    health_issues: String,
    help_request: String,
    home_occupants: String,
    refer_text: String,

    signature: String,
    signature_date: Date,
  },
  services: [{
    type: mongoose.ObjectId,
    ref: "CareService",
  }],
  notes: [{
    type: mongoose.ObjectId,
    ref: "CareService",
  }],
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

module.exports = mongoose.model('CareApplicant', careApplicantSchema);