/**
 * This file represents the document schema for the entire DOCUMENT PACKAGE
 * This is the master file for a client. Imagine it as a section in a filing
 * cabinet that holds the application, financial, property, handle-it and
 * project information. A 'folder' to hold a bunch of forms.
 *
 * This schema will create a mongoDB 'document'.
 * The document will have values, like '_id', and sub-documents,
 * like 'applications'.
 * A sub-document can have sub-documents or values.
 *
 *  Items on the left of the colon are database ID values.
 *  Items on the right of the colon are the data types allowed.
 *
 * Allowable types are:
 *     String      Number
 *     Date        Buffer
 *     Boolean     Mixed
 *     ObjectId    Array
 *
 * ObjectId is similar to a primary key in a relationship based database.
 */

// TODO: Potential solution to role based access here, https://docs.mongodb.com/manual/reference/operator/aggregation/redact/

/*
 List of status codes:

 discuss      - internal discussion needs to take place to determine if the document package is approved, denied, handle-it, or other
 new          - new document package, has yet to be reviewed
 phone        - document package has been seen, internal agent needs to contact client and verify document package information
 handle       - the document package is forwarded to the handle-it team to be completed
 documents    - additional documents are needed from the client before document package can proceed
 assess       - a member of catalyst must visit the property to determine the extent of repairs needed
 assessComp   - site assessment has been completed
 approval     - client's application is in the approval process that must be blessed by the board of directors
 declined     - the document package was declined for various reasons
 withdrawn    - client has freely withdrawn their application
 withdrawnooa - the client is outside the service area of Catalyst
 project      - the project has been approved and the document package will be converted to a project package
 waitlist     - these applications are waiting to be vetted, typically projects that require roofs that need to wait until the next project season.
 vetted       - Application Vetted
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var DocumentPackageSchema = new Schema({
    status:         String,
    // Status used for Version 2 of Application
    applicationStatus : {
        type: String,
        enum: [
            "new", 
            "phone", "discuss", "documents", "assess", "assessComp",
            "declined", "withdrawn", "withdrawnooa", "vetted", "waitlist",
            "transferred",
        ]
    },
    care_network_transfer: {
        type: mongoose.ObjectId, // Will default to null if not transferred
        ref: "CareApplicant",
    },
    care_network_transferred: {
        type: Boolean,
        default: false,
    },
	level : {type: Number, default: 1},
    created:        { type: Date, default: Date.now},
    updated:        { type: Date, default: Date.now},
    highlightPackage: { type: ObjectId },
    service_area : Boolean,
	app_name : String,
	app_year : Number,
	
	
    advocate:       {
        is_advocate:        Boolean,
		individual:         Boolean,
        npo:                Boolean,
        gov:                Boolean,
        name:               String,
        phone:              String,
		email:				String,
        relationship:       String,
        organization_name:  String
    },

    application:    {
        owns_home:      Boolean,
        name:       {
            first:     String,
            middle:    String,
            last:      String,
            preferred: String
		},
        dob:            {
            date:       Date
        },
        driver_license: {
			level : {type: Number, default: 5},
            number:     String
        },
        // status can return 3 values:
        // single - a person who has never married
        // divorced -  a person who has a legally terminated marriage
        // widowed - a person who has a deceased spouse
        marital:        {
            status:     String,
            spouse:     String,
        },
        spouse:         String,
        phone:          {
            preferred:  String,
            other:      String
        },
        email:          String,
        address:        {
            line_1:     String,
            line_2:     String,
            city:       String,
            state:      String,
            zip:        String    //CHANGED FROM Number
        },
        emergency_contact:  {
            name:           String,
            relationship:   String,
            phone:          String,
			email:			String	//added 06-08-2017
        },
        other_residents:{
            count:      Number,
            name:      [String],        // This is an array of strings
            age:       [String],        // This is an array of strings
			relationship: [String]      // This is an array of strings
        },
        veteran:        Boolean,
        language:       String,
        heard_about:    String,
        special_circumstances:  {
            level : {type: Number, default: 5},
            note:       String
        }
    },

    finance:    {
		
        mortgage:               {
            level : {type: Number, default: 5},
            payment:            String,
            up_to_date:         Boolean
        },
        income:                 {
            level : {type: Number, default: 5},
            amount:             String
        },
        assets:                 {
            level : {type: Number, default: 5},
            count:              Number,
            name:               [String],
            value:              [String]
        },
		total_income:			{
			level : {type: Number, default: 5},
			value:				String
		},
        client_can_contribute:  {
            value:              Boolean,
            amount:             String
        },
        associates_can_contribute:  {
            value:              Boolean,
            description:        String
        },
        requested_other_help:   {
            value:              Boolean,
            description:        String
        }
    },

    property:   {
        home_type:              String,
        ownership_length:       String,
        year_constructed:       String,
        requested_repairs:      String,
        client_can_contribute:  {
            value:              Boolean,
            description:        String
        },
        associates_can_contribute:  {
            value:              Boolean,
            description:        String
        }
    },

    recruitment:    {
        fbo_help: Boolean,
        fbo_name: String
    },
	
	signature:    {
		client_terms: Boolean,
		client_sig: String,
		client_date: Date
	},
	
	notes: {
		vet_summary: String,
		site_summary: String,
		
	},
	
	// Note: upon application submission, the Yes checkbox (name="tac-yes") and the digital signature (name="signature") at the bottom of the form are not captured anywhere.
	//Note above is done, along with timestamp
    project:    {
        status: String,
        crew_chief: String,
        project_advocate: String,
        site_host: String,
        project_start: Date,
        project_end: Date,
        actual_volunteer_count: String,
        actual_labor_count: String,
        actual_cost: String
    },

    // Store external links to documents (and client photos in the future).
    drive:      {
        photos: String,
        drive_url: String,
        vetting_drive_url: String
    }


});

var DocumentPackage = mongoose.model('DocumentPackage', DocumentPackageSchema);
module.exports = DocumentPackage;