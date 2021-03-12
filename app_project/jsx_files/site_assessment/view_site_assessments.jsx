class SiteAssessmentApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingDocs: [],
      completeDocs: [],
      project_approval: [],
      project_approved: [],
      transferredAssessments: [],
      showTransferred: false,
      assessmentsByDocs: {},
    };
    this.loadSiteAssessment();
  }

  loadSiteAssessment = () => {
    $.ajax({
      url: "/app_project/site_assessments/applications",
      type: "GET",
      context: this,
      success: function(dataObj) {
        console.log(dataObj);
        this.setState(state => {
          let pending = [],
              complete = [],
              project_approval = [],
              project_approved = [],
              assessmentsByDocs = {};
          dataObj.assessments.forEach(assessment => {
            if (assessment.documentPackage in assessmentsByDocs) {
              window.alert("Assessments found with the document ID: "
                + assessment.documentPackage);
            }
            assessmentsByDocs[assessment.documentPackage] = assessment;
          });
          
          let assessment;
          dataObj.documents.forEach(doc=> {
            assessment = assessmentsByDocs[doc._id];
            if (doc.status == "assess") {
              if (assessment && assessment.status != "pending") {
                window.alert("Conflict document & assessment status found for document: " 
                  + doc.app_name);
              }
              pending.push(doc);
            } else if (doc.status == "assessComp") {
              if (!assessment) {
                window.alert("No assessment found for document with completed status: " 
                  + doc.app_name);
              }
              if (assessment.status == "approval_process") {
                project_approval.push(doc);
              } else if (assessment.status == "approved") {
                project_approved.push(doc);
              } else if (assessment.status == "complete") {
                complete.push(doc);
              } else {
                window.alert("Conflict document & assessment status found for document: " 
                  + doc.app_name);
              }
              
            }
          });
          return {
            pendingDocs: pending,
            completeDocs: complete,
            project_approval: project_approval,
            project_approved: project_approved,
            assessmentsByDocs: assessmentsByDocs
          };
        })
      }
    });
  };

  convert_date(old_date) {
    let regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      let [year, month, date, hours, minutes] = result.slice(1,6);
      return new Date(Date.UTC(year, parseInt(month)-1  , date, hours, minutes));
    }
    return null;
  }

  getTransferredAssessments = () => {
    $.ajax({
      url: '/app_project/site_assessments/transferred',
      type: "GET",
      context: this,
      success: function(assessments) {
        console.log(assessments);
        this.setState({
          transferredAssessments: assessments,
        });
      }
    });
  };

  toggleShowTransferred = () => {
    if (!this.state.showTransferred) {
      this.getTransferredAssessments();
    }
    this.setState(state => {
      return {
        showTransferred: !state.showTransferred,
      };
    })
  };

  createHeader = () => {
    return (
    <thead>
      <tr>
          <th scope="col">Application #</th>
          <th scope="col">Name</th>
          <th scope="col">Address</th>
          <th scope="col">Assessment Date</th>
          <th scope="col">Assessment Status</th>
      </tr>
  </thead>);
  };

  /**
   * Craetes Assessment TR Row with a document.
   * Searches for assessment in state.assessmentsByDocs and
   * uses createAssessmentRow
   * @param {DocumentPackage Data} doc 
   * @returns TR element of assessment
   */
  createRowWithDocument = (doc) => {
    let assessment = (this.state.assessmentsByDocs) ?
    (this.state.assessmentsByDocs[doc._id]) : null;
    return this.createAssessmentRow(doc, assessment);
  };
  /**
   * Creates Assessment TR Row.
   * @param {DocumentPackage Data} doc 
   * @param {SiteAssessment Data} assessment 
   * @returns TR element of assessment
   */
  createAssessmentRow = (doc, assessment) => {
    const addObj = doc.application.address,
          nameObj = doc.application.name;
    const address = (addObj.line_2) ? 
        addObj.line_1 + " " + addObj.line_2 : addObj.line_1;
    let assessment_date;
    if (assessment && assessment.assessment_date) {
      const d = this.convert_date(assessment.assessment_date);
      // assessment_date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`
      assessment_date = /(.+:\d{2}):/.exec(d.toString())[1];
    }
    const status = (assessment) ? assessment.status : null,
          url = (assessment) ?
                  "/app_project/site_assessments/view/" + assessment._id :
                  "/app_project/site_assessments/view/app_id/" + doc._id,
          key = (assessment) ? assessment._id : doc._id;
    return (
      <tr key={key}>
        <td><a href={url}>{doc.app_name}</a></td>
        <td>{nameObj.first} {nameObj.last}</td>
        <td>
          {address} | {addObj.city}, {addObj.state} {addObj.zip}
        </td>
        <td>{assessment_date}</td>
        <td>{status}</td>
    </tr>
    );
  };

  render () {
    let doc;
    return (
    <div>
      <div>
        <h2>Pending Assessments</h2>
        <table className="table">
            {this.createHeader()}
            <tbody>
              {this.state.pendingDocs.map((document, index) => {
                return this.createRowWithDocument(document);
              })}
            </tbody>
        </table>
      </div>
      <div>
        <h2>Complete Assessments</h2>
        <table className="table">
            {this.createHeader()}
            <tbody>
              {this.state.completeDocs.map((document, index) => {
                return this.createRowWithDocument(document);
              })}
            </tbody>
        </table>
      </div>
      <div>
        <h2>Project Approval</h2>
        <table className="table">
            {this.createHeader()}
            <tbody>
              {this.state.project_approval.map((document, index) => {
                return this.createAssessmecreateRowWithDocumentntRow(document);
              })}
            </tbody>
        </table>
      </div>
      <div>
        <h2>Project Approved</h2>
        <table className="table">
            {this.createHeader()}
            <tbody>
              {this.state.project_approved.map((document, index) => {
                return this.createRowWithDocument(document);
              })}
            </tbody>
        </table>
      </div>
      <div>
        <h2 onClick={this.toggleShowTransferred}>
          Transferred Assessments
          <button type="button"
            className="btn btn-sm">
            {this.state.showTransferred ? "Hide" : "Show"}
          </button>
        </h2>
        {this.state.showTransferred ? 
        (<div>
          <table className="table">
            {this.createHeader()}
            <tbody>
              {this.state.transferredAssessments.map(assessment => {
                doc = assessment.documentPackage;
                return (
                  this.createAssessmentRow(doc, assessment)
                );
              })}
            </tbody>
          </table>
        </div>)
         : null}
      </div>
    </div>);
  }
}

(function loadReact() {
  ReactDOM.render(<SiteAssessmentApp />, document.getElementById("assessments_container"));
})();