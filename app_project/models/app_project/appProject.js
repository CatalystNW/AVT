const mongoose = require('mongoose');

const AppProjectSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    default: "upcoming",
    enum: ["upcoming", "complete", "in_progress", "withdrawn"]
  },
  type: String,
  start: Date,
  end: Date,

  partners: [{
    type: mongoose.ObjectId,
    ref: "partnerPackage",
  }],

  planlist: {
    type: mongoose.ObjectId,
    ref: "AppProjectPlanList"
  }

});

module.exports = mongoose.model("AppProject", AppProjectSchema);