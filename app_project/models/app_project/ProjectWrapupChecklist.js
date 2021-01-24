const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ProjectWrapupChecklistSchema = new mongoose.Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "AppProjects",
  },

  additional_checklist: [{
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  }],
  return_signup_sheet: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  record_volunteer_info: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  schedule_porta_pickup: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  schedule_waste_pickup: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  arrange_waste_disposal: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  return_materials_rental: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  turn_receipts_expenses: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  process_reimbursement_checks: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  submit_photos: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  submit_project_form: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  update_project_webpage: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  call_client: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  send_volunteer_email: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  determine_followup: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  },
  sending_closing_letter: {
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

module.exports = mongoose.model("ProjectWrapupChecklist", ProjectWrapupChecklistSchema);