export { SearchReport }

import { functionHelper } from "./functionHelper.js"

class SearchReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
    this.searchFormId = "search-applications-form";
  }

  searchForm = (e) => {
    e.preventDefault();
    console.log(functionHelper.get_data(this.searchFormId));
    $.ajax({
      url: "/app_project/report/search",
      type: "POST",
      data: functionHelper.get_data(this.searchFormId),
      context: this,
      success: function(projects) {
        console.log(projects);
        this.setState({
          projects: projects,
        });
      }
    });
  };

  resetForm = () => {
    document.getElementById(this.searchFormId).reset();
  };

  createForm = () => {
    return (
      <form id={this.searchFormId} onSubmit={this.searchForm}>
        <h3>Application Info</h3>
        <div className="form-group row">
          <div className="form-group col-sm-6 col-md-3">
            <label>First Name</label>
            <input className="form-control" type="text" name="first_name"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Last Name</label>
            <input className="form-control" type="text" name="last_name"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>City</label>
            <input className="form-control" type="text" name="city"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Zip Code</label>
            <input className="form-control" type="text" name="zip"></input>    
          </div>
        </div>

        <h3>Project Date</h3>
        <div className="form-group row">
          <div className="form-group col-sm-6 col-md-3">
            <label>Begin - Start</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="project_start_start"></input>
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Begin - End</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="project_start_end"></input>
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>End - Start</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="project_end_start"></input>
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>End - End</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="project_end_end"></input>
          </div>
        </div>

        <h3>Application Date</h3>
        <div className="form-group row">
          <div className="form-group col-sm-6 col-md-3">
            <label>Start</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="application_start_start"></input>
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>End</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="appliation_start_end"></input>
          </div>
        </div>
        <button type="submit">Submit</button>
        <button onClick={this.resetForm} type="button">Clear Form</button>
      </form>)
  }

  createApplicationsTable = () => {
    return (
      <div>
        <table className="table table-sm">
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col">Applicant</th>
              <th scope="col">Address</th>
              <th scope="col">Zip</th>
              <th scope="col">Status</th>
              <th scope="col">App ID</th>
            </tr>
          </thead>
          <tbody>
            {this.state.projects.map(project => {
              return (
              <tr key={project._id}>
                <td>{ !project.name || project.name.length == 0 ?
                    (<a href={"/app_project/view_projects/" + project._id} target="_blank">
                      N/A
                    </a>) :
                    (<a href={"/app_project/view_projects/" + project._id} target="_blank">
                      {project.name}
                    </a>)
                  }</td>
                <td>
                  <a href={"/view/" + project.documentPackage._id} target="_blank">
                    {project.documentPackage.application.name.first 
                              + " " + project.documentPackage.application.name.last}</a>
                </td>
                <td>
                  {project.documentPackage.application.address.city}, {project.documentPackage.application.address.state}
                </td>
                <td>{project.documentPackage.application.address.zip}</td>
                <td>{project.documentPackage.applicationStatus}</td>
                <td>{project.documentPackage.app_name}</td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
    )
  };

  render() {
    return (<div>
      {this.createForm()}

      {this.createApplicationsTable()}
    </div>)
  }
}