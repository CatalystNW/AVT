const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const AppProjectPlanListSchema = new mongoose.Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "AppProjects",
  },
  contract_mailed_to_client: {
    complete: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "UserPackage",
    },
  }
  
});

module.exports = mongoose.model("AppProjectPlanChecklist", AppProjectPlanListSchema);