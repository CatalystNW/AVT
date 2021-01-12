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
}, {
  timestamps: true,
});

materialsItemSchema.statics.makeCopy = async function(materialsItem) {
  var copy = new this();
  copy.description = materialsItem.description;
  copy.quantity = materialsItem.quantity;
  copy.price = materialsItem.price;
  copy.vendor = materialsItem.vendor;
  copy.obtained = materialsItem.obtained;
  // await copy.save();
  return copy;
};

module.exports = mongoose.model("MaterialsItem", materialsItemSchema);