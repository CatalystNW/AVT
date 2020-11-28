const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const workItemSchema = new Schema({
  timestamp: true, // createdAt, updatedAt

  siteAssessment: {type: Schema.Types.ObjectId, ref: "SiteAssessment"},

  applicationId: {type: Schema.Types.ObjectId, ref: "DocumentPackage"},
  materialsItems: [{type: Schema.Types.ObjectId, ref: "MaterialsItem"}],
  name: String,
  description, String,
  
  type: {
    type: String,
    enum: ["assessment", "project"],
  },
  handleit: Boolean,

  vetting_comments: String,
  assessment_comments: String,
  project_comments: String,
});

module.exports = mongoose.model("WorkItem", workItemSchema);