const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      MaterialsItem = require("./MaterialsItem");

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
    enum: ["handleit", "accepted", "declined", "to_review"],
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

// WorkItem to be copied needs to have materialsItems populated
workItemSchema.statics.makeCopy = async function(workItem) {
  var copyObj = workItem.toObject();
  delete copyObj._id;
  delete copyObj.materialsItems;
  copyObj.transferred = false;
  copyObj.type = "project";
  
  var new_workItem = new this(copyObj), materialsItem;

  for (var i=0; i<workItem.materialsItems.length; i++) {
    materialsItem = await MaterialsItem.makeCopy(
      workItem.materialsItems[i], new_workItem);
    console.log(materialsItem);
    copy.materialsItems.push(materialsItem._id);
  }

  await new_workItem.save()
  return new_workItem;
};

module.exports = mongoose.model("WorkItem", workItemSchema);