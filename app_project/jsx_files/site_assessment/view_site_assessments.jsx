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
            assessmentsByDocs[assessment.documentPackage] = assessment;
          });
          dataObj.documents.forEach(doc=> {
            if (doc.status == "assess") {
              pending.push(doc);
            } else if (doc.status == "assessComp") {
              complete.push(doc);
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
      </tr>
  </thead>);
  };

  createAssessmentRow = (doc) => {
    const addObj = doc.application.address,
          nameObj = doc.application.name;
    const address = (addObj.line_2) ? 
        addObj.line_1 + " " + addObj.line_2 : addObj.line_1;
    let assessment_date;
    if (this.state.assessmentsByDocs[doc._id] && 
        this.state.assessmentsByDocs[doc._id].assessment_date) {
      const d = this.convert_date(this.state.assessmentsByDocs[doc._id].assessment_date)
      // assessment_date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`
      assessment_date = /(.+:\d{2}):/.exec(d.toString())[1];
    }
    return (
      <tr key={doc._id}>
        <td><a href={"./view_site_assessments/app_id/" + doc._id}>{doc.app_name}</a></td>
        <td>{nameObj.first} {nameObj.last}</td>
        <td>
          {address} | {addObj.city}, {addObj.state} {addObj.zip}
        </td>
        <td>{assessment_date}</td>
    </tr>
    );
  };

  render () {
    let doc, address, app;
    return (
    <div>
      <div>
        <h2>Pending Assessments</h2>
        <table className="table">
            {this.createHeader()}
            <tbody>
              {this.state.pendingDocs.map((document, index) => {
                return this.createAssessmentRow(document);
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
                return this.createAssessmentRow(document);
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
                return this.createAssessmentRow(document);
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
                return this.createAssessmentRow(document);
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
                app = doc.application;
                address = (app.address.line_2) ? app.address.line_1 + " " + app.address.line_2 : doc.address.line_1;
                return (
                  <tr key={assessment._id}>
                    <td><a target="_blank" href={"./view_site_assessments/" + assessment._id}>{doc.app_name}</a></td>
                    <td>{app.name.first} {app.name.last}</td>
                    <td>{address} | {app.address.city}, {app.address.state} {app.address.zip}
                    </td>
                </tr>
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