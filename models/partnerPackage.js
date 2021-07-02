/**
 * Partners Package
 *     Part of Project View (once clicked on it) 
 * 
 *        Fields: Org Name, Org Address, Contact Name, Contact Phone, Contact email) 
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var PartnersSchema = new Schema({

  	applicationId: ObjectId,

    org_name: String,
    org_address: String,
    contact_name: String,
    contact_phone: String,
    contact_email: String
});

module.exports = mongoose.model('partnerPackage', PartnersSchema);