var UserPackage = require('../../../models/userPackage');
var CareAppNote = require('../../models/care/careappnote');
var CareApplicant = require('../../models/care/careApplicant');

var helper = require("../helper");

// Converts note entity to formatted data for frontend js
function convert_to_data(note_entity) {
  return {
    "name": note_entity.name,
    "note": note_entity.note,
    "date": note_entity.createdAt.toLocaleString()
  }
}

module.exports.post_appnote = post_appnote;
module.exports.get_appnotes = get_appnotes;
module.exports.edit_appnote = edit_appnote;

async function post_appnote(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      if (req.user && req.user.id && req.body.note && req.body.application_id) {
        var id = req.user._id, 
            note = req.body.note,
            application_id = req.body.application_id;
    
        var user = await UserPackage.findById(id).lean().exec();
    
        var name = user.contact_info.user_name.user_first;
        if (user.contact_info.user_name.user_middle) {
          name += " " + user.contact_info.user_name.user_middle;
        }
        name += " " + user.contact_info.user_name.user_last;
    
        var appnote = new CareAppNote();
    
        appnote.user = id;
        appnote.note = note;
        appnote.name = name;
        appnote.applicant = application_id;
    
        var applicant = await CareApplicant.findById(application_id).exec();
    
        applicant.notes.push(appnote._id);;
    
        await applicant.save();
    
        await appnote.save();
        res.status(201).json(convert_to_data(appnote));
      } else {
        res.status(500).end();
      }
    }
    
  );
  
};

async function get_appnotes(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var user_id = req.user.id;
      var app_id = req.params.application_id
      var notes = await CareAppNote.find({applicant: app_id}).lean().exec();

      for (var i=0; i< notes.length; i++) {
        notes[i].updatedAt = notes[i].updatedAt.toLocaleString();
        notes[i].createdAt = notes[i].createdAt.toLocaleString();
        if (user_id == notes[i].user) {
          notes[i].editable = true;
        }
      }
      res.status(200).json(notes);
    }
  );
}

async function edit_appnote(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var user_id = req.user.id;
      var appnote_id = req.params.appnote_id
      CareAppNote.findById(appnote_id).exec(
        async (err, appnote) => {
          if (err)
            res.status(404).end();
          else {
            if (appnote.user == user_id) {
              var note_text = req.body.note_text;
              if (note_text != appnote.note) {
                appnote.note = note_text
                await appnote.save();  
              }
              var data = appnote.toJSON();
              data.updatedAt = appnote.updatedAt.toLocaleString();
              data.createdAt = appnote.createdAt.toLocaleString();
              res.status(200).json(data);
            } else {
              res.status(401).end();
            }
          }
        }
      );
    }
  );
}