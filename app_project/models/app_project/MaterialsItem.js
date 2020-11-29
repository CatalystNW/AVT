const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const materialsItemSchema = new Schema({
  workItem: { type: Schema.Types.ObjectId, ref: "WorkItem"},
  description: String,
  quantity: Number,
  price: Number,
  vendor: String,
  obtained: Boolean,
  transferred: Boolean,
}, {
  timestamp: true,
});

module.exports = mongoose.model("MaterialsItem", materialsItemSchema);