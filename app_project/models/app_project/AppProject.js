const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
      
const AppProjectSchema = new Schema({
  name: String,
  status: {
    type: String,
    default: "upcoming",
    enum: ["upcoming", "complete", "in_progress", "withdrawn"]
  },
  drive_url: String,
  type: String,
  start: Date,
  end: Date,
  handleit: Boolean,
  documentPackage: {
    type: Schema.Types.ObjectId,
    ref: "DocumentPackage"
  },

  partners: [{
    type: Schema.Types.ObjectId,
    ref: "partnerPackage",
  }],

  workItems: [{
    type: Schema.Types.ObjectId,
    ref: "WorkItem"
  }],

  planlist: {
    type: Schema.Types.ObjectId,
    ref: "AppProjectPlanChecklist"
  },
  siteAssessment : {
    type: Schema.Types.ObjectId,
    ref: "SiteAssessment",
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "UserPackage",
  }],

  crew_chief: String,
  project_advocate: String,
  site_host: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model("AppProject", AppProjectSchema);