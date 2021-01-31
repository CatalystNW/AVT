var AppProject      = require("../../models/app_project/AppProject"),
    AppProjectNote  = require("../../models/app_project/AppProjectNote");

  module.exports.get_project_notes      = get_project_notes;

  async function get_project_notes(req, res) {
    let notes = await AppProjectNote.find({project: req.params.project_id});
    res.status(200).json(notes);
  }