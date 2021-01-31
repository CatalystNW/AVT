var AppProject      = require("../../models/app_project/AppProject"),
    AppProjectNote  = require("../../models/app_project/AppProjectNote");

  module.exports.get_project_notes      = get_project_notes;
  module.exports.create_project_note    = create_project_note;

  async function get_project_notes(req, res) {
    let notes = await AppProjectNote.find({project: req.params.project_id});
    res.status(200).json(notes);
  }

  async function create_project_note(req, res) {
    // var user = req.user._id // user used for later
    let project = await AppProject.findById(req.params.project_id);
    if (project && req.body.text) {
      var note = new AppProjectNote();
      note.text = req.body.text;
      note.project = req.params.project_id;
      await note.save();
      project.notes.push(note._id);
      project.save();
      res.status(200).json(note);
    } else {
      res.status(400).end();
    }
  }