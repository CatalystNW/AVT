const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
      
const AppProjectNoteSchema = new Schema({
  text: String,
  
  project : {
    type: Schema.Types.ObjectId,
    ref: "AppProject",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserPackage",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("AppProjectNote", AppProjectNoteSchema);