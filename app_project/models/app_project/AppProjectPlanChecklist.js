const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const AppProjectPlanListSchema = new mongoose.Schema({
  additional_checklist: [{
    name: String,
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  }],
  project: {
    type: Schema.Types.ObjectId,
    ref: "AppProjects",
  },
  contract_mailed_to_client: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  create_endis: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  email_req_volunteers_and_register: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  proj_activation_call_client: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  planning_visit: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  create_cost_lists: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  coordinate_site_host: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  coordinate_project_advocate: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  arranged_purchase_delivery: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  rent_pota_potty: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  rent_waste_bin: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  check_weather: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  verify_number_volunteers: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  send_final_volunteer_email: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  send_followup_volunteer_email: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
}, {
  timestamps: true,
});

AppProjectPlanListSchema.statics.translate = function() {
  return {
    contract_mailed_to_client: "",
    create_endis: "",
    email_req_volunteers_and_register: "",
    proj_activation_call_client: "",
    planning_visit: "",
    create_cost_lists: "",
    verify_site_resources: "",
    arranged_purchase_delivery: "",
    rent_pota_potty: "",
    rent_waste_bin: "",
    check_weather: "",
    verify_number_volunteers: "",
    send_final_volunteer_email: "",
    send_followup_volunteer_email: "",
  };
}

module.exports = mongoose.model("AppProjectPlanChecklist", AppProjectPlanListSchema);