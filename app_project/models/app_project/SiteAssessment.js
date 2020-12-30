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
  summary: String,
  status: {
    type: String,
    enum: ["complete", "pending"],
    default: "pending",
  },

  porta_potty_required: {type: Boolean, default: false,},
  waste_required: {type: Boolean, default: false, },
  porta_potty_cost: {type: Number, default: 0},
  waste_cost: {type: Number, default: 0},

  partners: [{ type: Schema.Types.ObjectId, ref: "partnerPackage"}],

  costsItems: [{ type: Schema.Types.ObjectId, ref: "CostsItem"}],
  
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
    
    var doc = await DocumentPackage.findById(app_id);
    if (!doc)
      return undefined;

    site_assessment.documentPackage = doc;
    await site_assessment.save();
    return site_assessment;
  } else{
    return undefined;
  }
};

module.exports = mongoose.model("SiteAssessment", siteAssessmentSchema);