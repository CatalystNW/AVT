const mongoose = require('mongoose'),
        

const AppProjectSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    default: "upcoming",
    enum: ["upcoming", "complete", "in_progress", "withdrawn"]
  },
  type: String,
  start: Date,
  end: Date,
  application: {
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

  costsItems: [{
    type: Schema.Types.ObjectId,
    ref: "CostsItem"
  }],

  planlist: {
    type: Schema.Types.ObjectId,
    ref: "AppProjectPlanList"
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