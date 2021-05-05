export {ApplicationReport}

import { functionHelper } from "../functionHelper.js"

class ApplicationReport extends React.Component {
  constructor(props) {
    super(props);
    this.formId = "application-form";
    this.state = {
      applications: [],
    };
  }

  searchForm = (e) => {
    e.preventDefault();
    $.ajax({
      url: "/app_project/report/applications",
      type: "POST",
      data: functionHelper.get_data(this.formId),
      context: this,
      success: function(applications) {
        console.log(applications);
        this.setState({
          applications: applications,
        });
      }
    });
  };

  createApplicationInfoTable = () => {
    return (
    <div>
      <h3>Applications Info</h3>
      <table className="table table-sm info-table">
        <tbody>
          <tr>
            <th scope="row"># Applications</th>
            <td>{this.state.applications.length}</td>
          </tr>
        </tbody>
      </table>
    </div>)
  }

  createApplicationTable = () => {
    return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Application Date</th>
          <th scope="col">Location</th>
        </tr>
      </thead>
      <tbody>
        {this.state.applications.map(document => {
          return (
          <tr key={document._id}>
            <td>
              <a href={"/view/" + document._id} target="_blank">
                {document.application.name.first 
                          + " " + document.application.name.last}</a>
            </td>
            <td>
              {functionHelper.convert_date(document.created).toLocaleDateString()}</td>
            <td>{document.application.address.city}</td>
          </tr>)
        })}
      </tbody>
    </table>)
  };

  render() {
    return (<div>
      <form onSubmit={this.searchForm} id={this.formId}>
        <h3>Application Submit Date</h3>
        <div className="form-group row">
          <div className="col-md-3">
            <label>Start</label>  
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="startDate"></input>
          </div>
          <div className="col-md-3">
            <label>End</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="endDate"></input>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {this.createApplicationInfoTable()}
      <h3>Applications</h3>
      {this.createApplicationTable()}
    </div>)
  }
}