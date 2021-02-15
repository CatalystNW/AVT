class ProjectsTransferApp extends React.Component {
  constructor(props) {
    super(props);
    this.getAssessments();
    this.state = {
      assessments: [],
    }
  }

  getAssessments = () => {
    $.ajax({
      url: "/app_project/site_assessments/to_transfer",
      type: "GET",
      context: this,
      success: function(assessments) {
        console.log(assessments);
        this.setState({
          assessments: assessments,
        })
      }
    });
  }

  render() {
    let doc, app, address;
    return (<div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Address</th>
            <th scope="col"># Work Items</th>
          </tr>
        </thead>
        <tbody>
          {this.state.assessments.map(assessment => {
            doc = assessment.documentPackage;
            app = doc.application;
            address = (app.address.line_2) ? app.address.line_1 + " " + app.address.line_2 : doc.address.line_1;
            return (
            <tr key={assessment._id}>
              <td><a href={"/app_project/project_transfer/" + assessment._id}>
                {app.name.first} {app.name.last}</a></td>
              <td>{address}</td>
              <td>{assessment.workItems.length}</td>
            </tr>)
          })}
        </tbody>
      </table>
      
    </div>);
  }
}

(function loadReact() {
  ReactDOM.render(<ProjectsTransferApp />, document.getElementById("transfer-container"));
})();