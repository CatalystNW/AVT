const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const siteAssessmentSchema = new Schema({
  timestamp = true,
  assessment_date: Date,
  project_start_date: Date,
  project_end_date: Date,

  application_id: { type: Schema.Types.ObjectId, ref: "DocumentPackage"},
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
});

module.exports = mongoose.model("SiteAssessment", siteAssessmentSchema);