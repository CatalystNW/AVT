var DocumentPackage = require("../../../models/documentPackage");

const authHelper = require("./AuthHelper");

module.exports.editDocumentStatus = editDocumentStatus;
module.exports.portDocumentStatusToApplicationStatus = portDocumentStatusToApplicationStatus;

async function editDocumentStatus(req, res) {
  if (!authHelper.hasRole(req, res, "VET")) {
    res.status(403).end(); return;
  }
  const statusSet = new Set([
    'discuss', 'new', 'phone', 'handle', 'documents',
    'assess', 'assessComp', 'approval', 'declined',
    'withdrawnooa', 'withdrawn', 'project',
    'waitlist', 'transferred']);
  const document = await DocumentPackage.findById(req.params.application_id);
  if (document) {
    try {
      document.applicationStatus = req.body.applicationStatus
      await document.save();
      res.status(200).json({status: req.body.applicationStatus});
    } catch (e) {
      res.status(400).end();
    }
  } else {
    res.status(404).end();
  }
}
/**
 * Find all Documents with undefined applicationStatus & attempts
 * to set it to Document.Status
 * @param {*} req 
 * @param {*} res 
 */
async function portDocumentStatusToApplicationStatus(req, res) {
  const docs = await DocumentPackage.find({applicationStatus: undefined});
  console.log(docs);
  for (let i=0; i< docs.length; i++) {
    if (docs[i].applicationStatus == undefined && docs[i].status) {
      try {
        docs[i].applicationStatus = docs[i].status;
        await docs[i].save();
      } catch (e) {

      } 
    }
  }
  res.status(200).send();
}