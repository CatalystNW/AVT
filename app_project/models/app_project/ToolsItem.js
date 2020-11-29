const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const toolsItemSchema = new Schema({
  siteAssessment: {type: Schema.Types.ObjectId, ref: "SiteAssessment"},
  description: String,
  quantity: Number,
  price: Number,
  vendor: String,
  obtained: Boolean,
  transferred: Boolean,
}, {
  timestamp: true,
});

module.exports = mongoose.model("ToolsItem", toolsItemSchema);