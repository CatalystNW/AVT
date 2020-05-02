const mongoose = require('mongoose');

const CareAppNoteSchema = new mongoose.Schema({
  note: String,
  name: String,
  user: {
    type: mongoose.ObjectId,
    ref: "UserPackage",
  },
  applicant: {
    type: mongoose.ObjectId,
    ref: "CareApplicant",
  },
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

module.exports = mongoose.model('CareAppNote', CareAppNoteSchema);