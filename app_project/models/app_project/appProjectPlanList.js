const mongoose = require('mongoose');

const AppProjectPlanListSchema = new mongoose.Schema({
  mailed_contract: {
    complete:
  }
  
});

module.exports = mongoose.model("AppProjectPlanList", AppProjectPlanListSchema);