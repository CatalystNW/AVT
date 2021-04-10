var AppProject      = require("../../models/app_project/AppProject"),
    AppProjectNote  = require("../../models/app_project/AppProjectNote"),
    UserPackage     = require("../../../models/userPackage");

const authHelper = require("./AuthHelper");

module.exports.get_project_notes      = get_project_notes;
module.exports.create_project_note    = create_project_note;
module.exports.delete_project_note    = delete_project_note;
module.exports.edit_project_note      = edit_project_note;

/**
 * Adds data attributes to note
 * @param {AppProjectNote(mutable/lean form)} note 
 * @param {User} userData User data to be retrieved
 */
function expandNoteData(note, userData) {
  if (userData != null) {
    note.user_name = userData.contact_info.user_name.user_first + " " + userData.contact_info.user_name.user_last;
    note.user_id = userData._id;
  }
  note.created_date = 
      `${note.createdAt.getMonth() + 1}-${
        note.createdAt.getDate()}-${note.createdAt.getFullYear()}`;
}

async function get_project_notes(req, res) {
  const data = {};
  let notes = await AppProjectNote.find({project: req.params.project_id}).lean();
  let i, userId, userData;
  const userMap = {};
  for (i=0; i< notes.length; i++) {
    userId = notes[i].user;
    if (userId != null) {
      if (userId && !(userId in userMap))  {
        // Hide userData since it contains password
        userData = await UserPackage.findById(userId);
        if (userData) {
          userMap[userId] = userData;
        } else {
          userMap[userId] = null;
        }
      }
      expandNoteData(notes[i], userMap[userId]);
    } else {
      expandNoteData(notes[i]);
    }
  }
  const context = authHelper.getUserContext(req, res);
  data.current_user_id = context.user_id;
  data.notes = notes;
  res.status(200).json(data);
}

async function create_project_note(req, res) {
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }

  const user = req.user;
  let project = await AppProject.findById(req.params.project_id);
  if (project && req.body.text) {    
    let note = new AppProjectNote();
    note.text = req.body.text;
    note.project = req.params.project_id;
    note.user = user._id;
    await note.save();
    project.notes.push(note._id);
    await project.save();
    // make note mutable for expandNoteData
    note = note.toObject();

    expandNoteData(note, user);
    res.status(200).json(note);
  } else {
    res.status(400).end();
  }
}

async function delete_project_note(req, res) {
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }

  const note_id = req.params.note_id;
  let project = await AppProject.findById(req.params.project_id),
      note = await AppProjectNote.findById(note_id);
  if (!project || !note) { // Want to make sure both exists before remove
    res.status(404).end();
    return;
  }
  if (project.complete) {
    res.status(400).end(); return;
  }
  // Confirm note belongs to user
  const context = authHelper.getUserContext(req, res);
  if (note.user.toString() != context.user_id.toString()) {
    res.status(403).end(); return;
  }
  var found = false;
  for (let i=0; i<project.notes.length; i++) {
    if (project.notes[i] == note_id) {
      found = true;
      project.notes.splice(i, 1);
      await project.save();
      break;
    }
  }
  if (!found) {
    res.status(404).end();
    return;
  }
  await AppProjectNote.findByIdAndDelete(note_id);
  res.status(200).end();
}

async function edit_project_note(req, res) {
  if (!authHelper.hasRole(req, res, "PROJECT_MANAGEMENT")) {
    res.status(403).end(); return;
  }
  
  const note_id = req.params.note_id;
  let project = await AppProject.findById(req.params.project_id),
      note = await AppProjectNote.findById(note_id);
  if (!project || !note) { // Want to make sure both exists before remove
    res.status(400).end();
    return;
  }
  // Confirm note belongs to user
  const context = authHelper.getUserContext(req, res);
  if (note.user.toString() != context.user_id.toString()) {
    res.status(403).end(); return;
  }
  if (req.body.property == "text") {
    note.text = req.body.value;
    await note.save();
  }
  
  res.status(200).end();
}