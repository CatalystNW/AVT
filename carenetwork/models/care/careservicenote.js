const mongoose = require('mongoose');

const CareServiceNoteSchema = new mongoose.Schema({
  note: String,
  service: {
    type: mongoose.ObjectId,
    ref: "CareService",
  },
}, {
  timestamps: true, // Creates createdAt & updatedAt
});

module.exports = mongoose.model('CareServiceNote', CareServiceNoteSchema);