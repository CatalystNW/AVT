var DocumentPackage = require("../../../models/documentPackage");

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const siteAssessmentSchema = new Schema({
  // default to today because react inputs need to a date to set to default value
  project_start_date: { type: Date, default: Date.now },
  project_end_date: { type: Date, default: Date.now },
  assessment_date: { type: Date, default: Date.now },
  
  documentPackage: { type: Schema.Types.ObjectId, ref: "DocumentPackage"},
  application_id: String,
  workItems: [{ type: Schema.Types.ObjectId, ref: "WorkItem"}],
  other_costs: [{
    name: String,
    cost: Number,
  }],

  partners: [{ type: Schema.Types.ObjectId, ref: "partnerPackage"}],

  toolsItems: [{ type: Schema.Types.ObjectId, ref: "ToolsItem"}],
  
  lead: { type: String, default: "no", enum: ["yes", "no", "unsure"]},
  asbestos: { type: String, default: "no", enum: ["yes", "no", "unsure"]},
  safety_plan: String,
  volunteers_required: Number,
}, {
  timestamps: true,
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