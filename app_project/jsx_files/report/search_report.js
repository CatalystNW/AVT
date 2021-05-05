export { SearchReport }

import { functionHelper } from "../functionHelper.js"

class SearchReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
    this.searchFormId = "search-applications-form";
  }

  filterProjects = (projects, options) => {
    console.log(options.cost.length);
    if ((options.volunteers && options.volunteers.length > 0) ||
        (options.hours && options.hours.length > 0) ||
        (options.cost && options.cost.length > 0)) {
      let newProjects = [],
          cost, hours, volunteers;
      projects.forEach(project => {
        cost = 0;
        hours = 0;
        volunteers = project.volunteer_hours;;
        project.workItems.forEach(workItem => {
          workItem.materialsItems.forEach(materialsItem => {
            cost += materialsItem.price * materialsItem.quantity;
          });
          volunteers += workItem.volunteers_required;
          hours += project.volunteer_hours;
        });
        if (options.volunteers && options.volunteers.length > 0) {
          if (options.volunteers_options == "gte") {
            if (volunteers < options.volunteers)
              return;
          } else {
            if (volunteers > options.volunteers)
              return;
          }
        }
        if (options.hours && options.hours.length > 0) {
          if (options.hours_options == "gte") {
            if (hours < options.hours)
              return;
          } else {
            if (hours > options.hours)
              return;
          }
        }
        if (options.cost && options.cost.length > 0) {
          if (options.cost_options == "gte") {
            if (cost < options.cost)
              return;
          } else {
            if (cost > options.cost)
              return;
          }
        }
        newProjects.push(project);
      });
      return newProjects;
    } else {
      return projects;
    }
  };

  searchForm = (e) => {
    e.preventDefault();
    let options = functionHelper.get_data(this.searchFormId);
    $.ajax({
      url: "/app_project/report/search",
      type: "POST",
      data: options,
      context: this,
      success: function(projects) {
        this.setState({
          projects: this.filterProjects(projects, options),
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

        <h3>Project Leaders</h3>
        <div className="form-group row">
          <div className="form-group col-sm-6 col-md-3">
            <label>Site Host</label>
            <input className="form-control" type="text" name="site_host"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Project Advocate</label>
            <input className="form-control" type="text" name="project_advocate"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Crew Chief</label>
            <input className="form-control" type="text" name="crew_chief"></input>    
          </div>
          <label>AND</label><input type="radio" name="leaders_option" value="and" defaultChecked></input>
          <label>OR</label><input type="radio" name="leaders_option" value="or"></input>
        </div>

        <h3>Project Options</h3>
        <div className="form-group row">
          <div className="form-group col-sm-6 col-md-3">
            <label>Project Name</label>
            <input className="form-control" type="text" name="project_name"></input>
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Number Volunteers</label>
            <input className="form-control" type="number" name="volunteers"></input>    
            <label>Less Than</label><input type="radio" name="volunteers_options" value="gte" defaultChecked></input>
            <label>Greater Than</label><input type="radio" name="volunteers_options" value="lte"></input>
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Cost</label>
            <input className="form-control" type="number" name="cost"></input>    
            <label>Less Than</label><input type="radio" name="cost_options" value="gte" defaultChecked></input>
            <label>Greater Than</label><input type="radio" name="cost_options" value="lte"></input>
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Volunteer Hours</label>
            <input className="form-control" type="number" name="hours"></input>    
            <label>Less Than</label><input type="radio" name="hours_options" value="gte" defaultChecked></input>
            <label>Greater Than</label><input type="radio" name="hours_options" value="lte"></input>
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
              <th scope="col">Handle-it</th>
              <th scope="col">Applicant</th>
              <th scope="col">Address</th>
              <th scope="col">Zip</th>
              <th scope="col">Status</th>
              <th scope="col">App ID</th>
              <th scope="col">SH</th>
              <th scope="col">PA</th>
              <th scope="col">CC</th>
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
                <td>{project.handleit ? "Yes" : "No"}</td>
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
                <td>{project.site_host}</td>
                <td>{project.project_advocate}</td>
                <td>{project.crew_chief}</td>
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