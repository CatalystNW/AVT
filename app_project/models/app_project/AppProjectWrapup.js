const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const AppProjectWrapupSchema = new mongoose.Schema({
  return_signup_sheet: [{
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
  record_volunteer_info: [{
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
  schedule_porta_pickup: [{
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
  schedule_waste_pickup: [{
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
  arrange_waste_disposal: [{
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
  return_materials_rental: [{
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
  turn_receipts_expenses: [{
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
  process_reimbursement_checks: [{
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
  submit_photos: [{
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
  submit_project_form: [{
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
  update_project_webpage: [{
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
  call_client: [{
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
  send_volunteer_email: [{
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
  determine_followup: [{
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
  sending_closing_letter: [{
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
});

module.exports = mongoose.model("AppProjectWrapup", AppProjectWrapupSchema);