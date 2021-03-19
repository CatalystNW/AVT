var DocumentPackage = require("../../../models/documentPackage");

const authHelper = require("./AuthHelper");

module.exports.editDocumentStatus = editDocumentStatus;

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
    if (statusSet.has(req.body.status)) {
      document.status = req.body.status;
      await document.save();
      res.status(200).json({status: req.body.status});
    } else {
      res.status(400).end();
      return;
    }
    
  } else {
    res.status(404).end();
  }
}