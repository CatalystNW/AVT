const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const materialsItemSchema = new Schema({
  workItem: { type: Schema.Types.ObjectId, ref: "WorkItem"},
  transferred: {
    type: Boolean,
    default: false,
  },
  description: String,
  quantity: Number,
  price: Number,
  cost: Number,
  vendor: String,
  obtained: Boolean,
  transferred: Boolean,
}, {
  timestamps: true,
});

module.exports = mongoose.model("MaterialsItem", materialsItemSchema);