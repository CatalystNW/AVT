var DocumentPackage = require("../../../models/documentPackage");

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const siteAssessmentSchema = new Schema({
  assessment_date: Date,
  project_start_date: Date,
  project_end_date: Date,

  documentPackage: { type: Schema.Types.ObjectId, ref: "DocumentPackage"},
  application_id: String,
  workItems: [{ type: Schema.Types.ObjectId, ref: "WorkItem"}],
  other_costs: [{
    name: String,
    cost: Number,
  }],

  partners: [{ type: Schema.Types.ObjectId, ref: "partnerPackage"}],

  toolItems: [{ type: Schema.Types.ObjectId, ref: "ToolsItem"}],
  
  lead: { type: String, default: "No", enum: ["Yes", "No", "Unsure"]},
  abestos: { type: String, default: "No", enum: ["Yes", "No", "Unsure"]},
  safety_plan: String,
  volunteers_required: Number,
}, {
  timestamp: true,
});

siteAssessmentSchema.statics.create = async function(app_id) {
  if (app_id) {
    var site_assessment = new this();
    site_assessment.application_id = app_id;
    
    var doc = DocumentPackage.findById(app_id);
    if (!doc)
      return undefined;

    await site_assessment.save();
    site_assessment.documentPackage = doc;
    return site_assessment;
  } else{
    return undefined;
  }
}

module.exports = mongoose.model("SiteAssessment", siteAssessmentSchema);