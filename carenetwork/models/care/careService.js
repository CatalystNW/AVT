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

careServiceSchema.methods.get_obj = function() {
  return {
    _id: this._id,
    status: this.status,
    applicant: this.applicant,
    description: this.description,
    volunteer: this.volunteer,
    service_date: this.service_date.toLocaleString(),
    createdAt: this.createdAt.toLocaleString(),
    updatedAt: this.updatedAt.toLocaleString(),
    view_service_url: "/carenetwork/view_service/" + this._id,
  }
}

module.exports = mongoose.model("CareService", careServiceSchema);