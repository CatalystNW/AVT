const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const workItemSchema = new Schema({
  documentPackage: {type: Schema.Types.ObjectId, ref: "DocumentPackage"},
  materialsItems: [{type: Schema.Types.ObjectId, ref: "MaterialsItem"}],
  name: String,
  description: String,
  locked: {type: Boolean, default: false,},
   
  type: {
    type: String,
    enum: ["assessment", "project"],
  },
  handleit: Boolean,

  vetting_comments: String,
  assessment_comments: String,
  project_comments: String,
}, {
  timestamps: true, // createdAt, updatedAt
});

module.exports = mongoose.model("WorkItem", workItemSchema);