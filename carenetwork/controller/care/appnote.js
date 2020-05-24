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

async function post_appnote(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      if (req.user && req.user.id && req.body.note && req.body.application_id) {
        var id = req.user._id, 
            note = req.body.note
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
      var app_id = req.params.application_id
      var notes = await CareAppNote.find({applicant: app_id}).lean().exec();
      var dataArr = [], note;
      for (var i=0; i< notes.length; i++) {
        dataArr.push(convert_to_data(notes[i]));
      }
      res.status(200).json(dataArr);
    }
    
  );

  
}
