const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
      
const AppProjectSchema = new Schema({
  name: String,
  status: {
    type: String,
    default: "upcoming",
    enum: ["upcoming", "complete", "in_progress", "withdrawn"]
  },
  complete: {
    type: Boolean,
    default: false,
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
  volunteer_hours: {type: Number, default: 0},

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
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "AppProjectNote",
  }],

  crew_chief: String,
  project_advocate: String,
  site_host: String,
}, {
  timestamps: true,
});

/**
 * Changes project, work items, & materials items complete as true.
 * This is a static file since it completes a new search for the
 * AppProject each time to ensure that the items are populated correctly.
 * @param {String} project_id 
 * @return AppProject
 */
AppProjectSchema.statics.markComplete = async function(project_id) {
  const project = this.findById(project_id)
        .populate({path:"workItems", model: "WorkItem", populate: 
          {path:"materialsItems", model: "MaterialsItem"}});
  if (!project) {
    return;
  }
  for (let i=0, workitem; i< project.workItems.length; i++) {
    workitem = project.workItems[i];
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
  project.complete = true;
  await project.save();
  return project;
};

module.exports = mongoose.model("AppProject", AppProjectSchema);