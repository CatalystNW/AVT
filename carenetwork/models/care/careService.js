const mongoose = require('mongoose');

const careServiceSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.ObjectId,
    ref: "CareApplicant",
  },
  volunteer: String,
  note: String,
  service_date: Date,
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

module.exports = mongoose.model("CareService", careServiceSchema);