const mongoose = require('mongoose');

const careServiceSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.ObjectId,
    ref: "CareApplicant",
  },
  description: String,
  volunteer: String,
  notes: [{
    type: mongoose.ObjectId,
    ref: "CareServiceNote",
  }],
  service_date: Date,
  status: {
    type: String,
    default: "not_started",
    enum: ["complete", "not_started", "started"],
  }
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

module.exports = mongoose.model("CareService", careServiceSchema);