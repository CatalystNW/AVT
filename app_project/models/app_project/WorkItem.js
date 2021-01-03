const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const workItemSchema = new Schema({
  documentPackage: {type: Schema.Types.ObjectId, ref: "DocumentPackage"},
  materialsItems: [{type: Schema.Types.ObjectId, ref: "MaterialsItem"}],
  materials_cost: {type: Number, default: 0},
  name: String,
  description: String,
  locked: {type: Boolean, default: false,},
   
  type: {
    type: String,
    enum: ["assessment", "project"],
  },
  handleit: Boolean,
  status: {
    type: String,
    enum: ["accepted", "declined", "to_review"],
    default: "to_review",
    setDefaultsOnInsert: true,
  },
  transferred: {
    type: Boolean,
    default: false,
  },

  vetting_comments: String,
  assessment_comments: String,
  project_comments: String,
}, {
  timestamps: true, // createdAt, updatedAt
});

module.exports = mongoose.model("WorkItem", workItemSchema);