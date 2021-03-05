var DocumentPackage = require("../../../models/documentPackage"),
    WorkItem = require("./WorkItem"),
    MaterialsItem = require("./MaterialsItem");

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const siteAssessmentSchema = new Schema({
  // default to today because react inputs need to a date to set to default value
  project_start_date: { type: Date},
  project_end_date: { type: Date},
  assessment_date: { type: Date},
  
  documentPackage: { type: Schema.Types.ObjectId, ref: "DocumentPackage"},
  application_id: String,
  workItems: [{ type: Schema.Types.ObjectId, ref: "WorkItem"}],
  other_costs: [{
    name: String,
    cost: Number,
  }],
  drive_url: String,
  projects: [{
    type: Schema.Types.ObjectId,
    ref: "AppProject"
  }],
  summary: String,
  status: {
    type: String,
    enum: ["complete", "pending", "approval_process", "approved", "declined", "transferred"],
    default: "pending",
  },
  transferred: {
    type: Boolean,
    default: false,
  },
  complete: {
    type: Boolean,
    default: false,
  },

  porta_potty_required: {type: Boolean, default: false,},
  waste_required: {type: Boolean, default: false, },
  porta_potty_cost: {type: Number, default: 0},
  waste_cost: {type: Number, default: 0},

  partners: [{ type: Schema.Types.ObjectId, ref: "partnerPackage"}],
  
  lead: { type: String, default: "unsure", enum: ["yes", "no", "unsure"]},
  asbestos: { type: String, default: "unsure", enum: ["yes", "no", "unsure"]},
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

    site_assessment.documentPackage = app_id;
    await site_assessment.save();
    await doc.save();
    return site_assessment;
  } else{
    return undefined;
  }
};
/**
 * Mark Site Assessment given by assessment_id and its workItems &
 * materialsItems as complete and transferred (or not depending on trasnferred
 * parameter). Saves all of the changes as well.
 * 
 * Status is also changed to transferred (if transferred is true and
 * assessment must be in "approved" status) or
 * declined (if transferred is false).
 * @param {String} assessment_id 
 * @param {boolean} transferred 
 * Returns Site Assessment with Work Items & Materials Items populated.
 */
siteAssessmentSchema.methods.markComplete = async function(assessment_id, transferred) {
  transferred = transferred === true;
  let site_assessment = await SiteAssessment.findById(assessment_id)
        .populate({path:"workItems", model: "WorkItem", populate: {path:"materialsItems", model: "MaterialsItem"}});
  if (!site_assessment) {
    return;
  }
  const oldStatus = site_assessment.status;
  if (oldStatus != "approved" && transferred) {
    return;
  }
  for (let i=0, workitem; i < site_assessment.workItems; i++) {
    workitem = site_assessment.workItems[i];
    for (let j=0, materialsItem; j < workitem.materialsItems.length; j++) {
      materialsItem = workitem.materialsItem[j];
      materialsItem.complete = true;
      materialsItem.transferred = transferred;
      await materialsItems.save();
    }
    workitem.complete = true;
    workitem.transferred = transferred;
    await workitem.save();
  }
  site_assessment.workItems.forEach(workitem => {
    
  });
  site_assessment.complete = true;
  site_assessment.transferred = transferred;
  site_assessment.status = (transferred) ? "transferred" : "declined";
  await site_assessment.save();
  return site_assessment;
}

module.exports = mongoose.model("SiteAssessment", siteAssessmentSchema);