const mongoose = require('mongoose');

const careApplicantSchema = new mongoose.Schema({
  reference: {
    type: String, // Format of CARE-[year]-[Count (+1 of latest one)]
    match: [/CARE\-\d{4}\-\d+/, "CARE-[year]-[Count (+1 of latest one)]"],
    unique: true,
    required: true,
  },

  application_status: {
    type: String,
    default: "never_contacted",
    enum: [
      "to_be_contacted", "assigned_caller", "help_requested", 
      "contact_complete", "never_contacted", "do_not_contact",
      "appvet_transferred"],
  },
  appvet_id: {
    type: mongoose.ObjectId, // Will default to null if not transferred
    ref: "DocumentPackage",
  },

  application: {
    first_name: String,
    middle_name: String,
    last_name: String,
    email: String,
    phone: String,
    other_phone: String,

    dob: Date,

    marital_status: {
      type: String,
      enum: ["widow", "married", "single"]
    },

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
    ref: "CareAppNote",
  }],
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

careApplicantSchema.statics.get_next_ref = async function() {
  var year = (new Date()).getFullYear();

  var prev_apps = await this.find({ createdAt: { $gte: year, } }).sort({"createdAt": "descending"}).exec();

  // Get prev reference & increment it
  var ref_num;
  if (prev_apps.length > 0) {
    var prev_reference = prev_apps[0].reference;
    var re = /\w+\-\d+\-(\d+)/;
    var result = re.exec(prev_reference);
    ref_num = parseInt(result[1]) + 1;
  } else {
    ref_num = 1;
  }

  return `CARE-${year}-${ref_num}`;
};

careApplicantSchema.statics.create_app =  async function(data) {
  var app_ref = await this.get_next_ref();

  var careapp = new this();

  careapp.reference = app_ref;

  for (field in fields_map) {
    field_obj = fields_map[field];
    
    value = data[field];

    if (value == undefined || value.length <= 0)
      continue;

    // Split path string into array. Used for navigation
    path_arr = field_obj.path.split("/");

    var o;
    // if (field_obj.schema == "careApplicant")
      o = careapp;
    // else
    //   o = careContact
    
    // Navigate through model objects thru path array
    for (i=0; i< path_arr.length; i++) {
      if (i == path_arr.length - 1)
        o[path_arr[i]] = value;
      else
        o = o[path_arr[i]];
    }
  }

  for (var key in data) {
    careapp[key] = data[key];
  }
  
  await careapp.save();
  return careapp;
};


var fields_map = {
  application_status: { // This has a default value
    required: false,
    schema: "careApplicant",
    path: "application_status"
  },
  appvet_id: {
    required: false,
    schema: "careApplicant",
    path: "appvet_id"
  },
  first_name: {
    required: true,
    schema: "careApplicant",
    path: "application/first_name"
  },
  middle_name: {
    required: false,
    schema: "careApplicant",
    path: "application/middle_name"
  },
  last_name: {
    required: true,
    schema: "careApplicant",
    path: "application/last_name"
  },
  email: {
    required: false,
    schema: "careApplicant",
    path: "application/email"
  },
  phone: {
    required: true,
    schema: "careApplicant",
    path: "application/phone"
  },
  other_phone: {
    required: false,
    schema: "careApplicant",
    path: "application/other_phone"
  },
  dob: {
    required: true,
    schema: "careApplicant",
    path: "application/dob"
  },
  marital_status: {
    required: true,
    schema: "careApplicant",
    path: "application/marital_status"
  },
  line_1: {
    required: true,
    schema: "careApplicant",
    path: "application/address/line_1"
  },
  line_2: {
    required: false,
    schema: "careApplicant",
    path: "application/address/line_2"
  },
  city: {
    required: true,
    schema: "careApplicant",
    path: "application/address/city"
  },
  state: {
    required: true,
    schema: "careApplicant",
    path: "application/address/state"
  },
  zip: {
    required: true,
    schema: "careApplicant",
    path: "application/address/zip"
  },
  health_issues: {
    required: false,
    schema: "careApplicant",
    path: "application/health_issues"
  },
  help_request: {
    required: true,
    schema: "careApplicant",
    path: "application/help_request"
  },
  home_occupants: {
    required: false,
    schema: "careApplicant",
    path: "application/home_occupants"
  },
  refer_text: {
    required: false,
    schema: "careApplicant",
    path: "application/refer_text"
  },
  signature: {
    required: true,
    schema: "careApplicant",
    path: "application/signature"
  },
  signature_date: {
    required: true,
    schema: "careApplicant",
    path: "application/signature_date"
  },
  contact_name: {
    required: true,
    schema: "careApplicant",
    path: "application/contact_name"
  },
  contact_relationship: {
    required: true,
    schema: "careApplicant",
    path: "application/contact_relationship"
  },
  contact_phone: {
    required: true,
    schema: "careApplicant",
    path: "application/contact_phone"
  },
  contact_email: {
    required: false,
    schema: "careApplicant",
    path: "application/contact_email"
  },
};

module.exports = mongoose.model('CareApplicant', careApplicantSchema);