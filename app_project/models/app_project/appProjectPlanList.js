const mongoose = require('mongoose');

const AppProjectPlanListSchema = new mongoose.Schema({
  mailed_contract: {
  }
  
});

module.exports = mongoose.model("AppProjectPlanList", AppProjectPlanListSchema);