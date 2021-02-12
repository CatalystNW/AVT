class SiteAssessmentApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingDocs: [],
      completeDocs: [],
      showTransferred: false,
    };
    this.loadSiteAssessment();
  }

  loadSiteAssessment = () => {
    $.ajax({
      url: "/app_project/site_assessments/applications",
      type: "GET",
      context: this,
      success: function(dataObj) {
        this.setState(state => {
          let pending = [],
              complete = [];
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
          };
        })
      }
    });
  };

  createAssessmentRow = (doc) => {
    const address = (doc.address.line_2) ? doc.address.line_1 + " " + doc.address.line_2 : doc.address.line_1;
    return (
      <tr key={doc.id}>
        <td><a target="_blank" href={"./view_site_assessments/app_id/" + doc.id}>{doc.app_name}</a></td>
        <td>{doc.name.first} {doc.name.last}</td>
        <td>{address} |
            {doc.address.city}, {doc.address.state} {doc.address.zip}
        </td>
    </tr>
    );
  };

  toggleShowTransferred = () => {
    this.setState(state => {
      return {
        showTransferred: !state.showTransferred,
      };
    })
  }

  render () {
    return (
    <div>
      <div>
        <h2>Pending Assessments</h2>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Application #</th>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                </tr>
            </thead>
            <tbody>
              {this.state.pendingDocs.map((doc, index) => {
                return this.createAssessmentRow(doc);
              })}
            </tbody>
        </table>
      </div>
      <div>
        <h2>Complete Assessments</h2>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Application #</th>
                    <th scope="col">Name</th>
                    <th scope="col">Address</th>
                </tr>
            </thead>
            <tbody>
              {this.state.completeDocs.map((doc, index) => {
                return this.createAssessmentRow(doc);
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
        
      </div>
    </div>);
  }
}

(function loadReact() {
  ReactDOM.render(<SiteAssessmentApp />, document.getElementById("assessments_container"));
})();