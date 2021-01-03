const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

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

  partners: [{
    type: Schema.Types.ObjectId,
    ref: "partnerPackage",
  }],

  planlist: {
    type: Schema.Types.ObjectId,
    ref: "AppProjectPlanList"
  },
  siteAssessment : {
    type: Schema.Types.ObjectId,
    ref: "SiteAssessment",
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model("AppProject", AppProjectSchema);