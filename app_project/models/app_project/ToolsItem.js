const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const toolsItemSchema = new Schema({
  siteAssessment: {type: Schema.Types.ObjectId, ref: "SiteAssessment"},
  description: String,
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

module.exports = mongoose.model("ToolsItem", toolsItemSchema);