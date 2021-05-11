export { ProjectReport }

import { functionHelper } from "../functionHelper.js"

class ProjectReport extends React.Component {
  constructor(props) {
    super(props);
    this.formId = "projects-report-form";
    this.state = {
      projects: [],
    }
    this.projectTableId = "projets-table";
  }

  componentDidMount() {
    $(".datepicker").datepicker({
      orientation: 'bottom',
      format: 'yyyy-mm-dd',
    });
  }

  searchForm = (e) => {
    e.preventDefault();
    $.ajax({
      url: "/app_project/report/project",
      type: "POST",
      data: functionHelper.get_data(this.formId),
      context: this,
      success: function(projects) {
        console.log(projects);

        this.setState({
          projects: projects,
        });
      }
    });
  };

  createPartnersTable = () => {
    const partnersDict = {};
    this.state.projects.forEach(project => {
      project.partners.forEach(partner => {
        if (partner.org_name in partnersDict) {
          partnersDict[partner.org_name] += 1;
        } else {
          partnersDict[partner.org_name] = 1;
        }
      })
    });

    const partnersArray = [];
    let tr;
    for (let name in partnersDict) {
      partnersArray.push(
        (<tr key={"part-" + name}>
          <td>{name}</td>
          <td>{partnersDict[name]}</td>
        </tr>)
      );
    }

    return (
    <div>
      <h2>Partners</h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">Partner</th>
            <th scope="col">Number of Projects</th>
          </tr>
        </thead>
        <tbody>
          {partnersArray}
        </tbody>
      </table>
    </div>)
  };

  createProjectInfoTable = () => {
    let num_handleits = 0,
        num_projects = 0,
        num_volunteers = 0,
        cost = 0,
        volunteer_hours = 0;
    this.state.projects.forEach(project => {
      volunteer_hours += project.volunteer_hours;
      if (project.handleit) {
        num_handleits++;
      } else {
        num_projects++;
      }

      project.workItems.forEach(workItem => {
        workItem.materialsItems.map(materialsItem => {
          cost += materialsItem.price * materialsItem.quantity;
        });
        num_volunteers += workItem.volunteers_required;
      });
    });

    return(
      <div>
        <h2>Project Info</h2>
        <div>
          <table className="table table-sm info-table">
            <tbody>
              <tr>
                <th scope="row"># Handle-it Projects</th>
                <td>{num_handleits}</td>
              </tr>
              <tr>
                <th scope="row"># Projects</th>
                <td>{num_projects}</td>
              </tr>
              <tr>
                <th scope="row">Total Volunteers</th>
                <td>{num_volunteers}</td>
              </tr>
              <tr>
                <th scope="row">Total Cost</th>
                <td>{cost}</td>
              </tr>
              <tr>
                <th scope="row">Total Labor Hours</th>
                <td>{volunteer_hours}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  };

  onClick_csv = () => {
    let projectDataArray = functionHelper.getTableText(this.projectTableId);
    functionHelper.exportCSV("projects-report-", projectDataArray);
  };

  render() {
    return (
    <div>
      <form onSubmit={this.searchForm} id={this.formId}>
        <h3>Start Date</h3>
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
      {this.createPartnersTable()}
      {this.createProjectInfoTable()}

      <h2>Projects 
        <button onClick={this.onClick_csv}
          className="btn btn-sm btn-success">
        CSV</button></h2>
      {functionHelper.createTable(this.projectTableId, this.state.projects, true)}
    </div>);
  }
}