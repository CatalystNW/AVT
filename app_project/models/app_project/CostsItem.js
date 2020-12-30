const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const costsItemSchema = new Schema({
  siteAssessment: {type: Schema.Types.ObjectId, ref: "SiteAssessment"},
  description: String,
  item_type: {type: String, default: "other", enum: ["tools", "other", ]},
  transferred: {
    type: Boolean,
    default: false,
  },
  price: Number,
  vendor: String,
  obtained: Boolean,
  transferred: Boolean,
  returned: Boolean,
  return_date: Date,
  borrow_date: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model("CostsItem", costsItemSchema);