const mongoose = require('mongoose');

const CareServiceNoteSchema = new mongoose.Schema({
  note: String,
  applicant: {
    type: mongoose.ObjectId,
    ref: "CareApplicant",
  },
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

module.exports = mongoose.model('CareServiceNote', CareServiceNoteSchema);