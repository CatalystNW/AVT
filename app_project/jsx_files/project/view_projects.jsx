import { functionHelper } from "../functionHelper.js"

class AppProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      showHandleitUpcoming: true,
      showHandleitInProgress: true,
      showProjectUpcoming: true,
      showProjectInProgress: true,
      showCompleted: true,
      showWithdrawn: true,
      selectedCompleteYear: "all",
      completeYears: [], // Contains years of completed projects
    }
    this.get_projects();
  }

  get_projects = () => {
    var that = this;
    $.ajax({
      url: "./projects",
      type: "GET",
      success: function(projects) {
        console.log(projects);
        let yearSet = new Set(), 
            year;

        // Convert project.date to project>startDate (with date obj) &&
        // Add to state.compleetYears
        projects.forEach(project => {
          project.startDate = functionHelper.convert_date(project.start);
          if (project.startDate && project.status == "complete") {
            year = project.startDate.getFullYear();
            if (year && !yearSet.has(year)) {
              yearSet.add(parseInt(year));
            }
          }
        });
        that.setState({
          completeYears: Array.from(yearSet).sort().reverse(),
          projects: projects,
        })
      },
    });
  }  

  /**
   * Create Project TR element
   * @param {*} status-projet.status[String]
   * @param {*} filterStatus 0 to not filter, 1 to filter out non-handleit, 
   *  2 to filter out handleit
   */
  createProjectRows = (status, filterStatus) => {
    const projects = [];
    let doc, app, address, handleitColumn;
    
    for (let project of this.state.projects) {
      if (project.status == "complete" &&
          this.state.selectedCompleteYear != "all" &&
          (project.startDate == null || 
            project.startDate.getFullYear() != this.state.selectedCompleteYear)) {
        continue;
      }
      if (project.status != status )
        continue;
      if (filterStatus == 2 && project.handleit ||
          filterStatus == 1 && !project.handleit) {
        continue;
      }
      doc = project.documentPackage;
      app = doc.application;
      address = `${app.address.city}, ${app.address.state}`;
      // show column only when both handleit & projects are shown
      handleitColumn = (filterStatus == 0) ?
          (<td className="col-sm-1" >{(project.handleit) ? "✔️" : ""}</td>) : null;
      projects.push(
        <tr key={project._id}>
          <td className="col-sm-2" >
            <a href={"./view_projects/"+ project._id}>
              { (project.name && project.name.length > 0) ? project.name : "N/A"}</a></td>
          { handleitColumn }
          <td className="col-sm-2" >{app.name.first} {app.name.last}</td>
          <td className="col-sm-2" >{address}</td>
          <td className="col-sm-2" >
            {project.startDate ? project.startDate.toLocaleDateString() : ""}
          </td>
          <td className="col-sm-1" >{project.crew_chief}</td>
          <td className="col-sm-1" >{project.project_advocate}</td>
          <td className="col-sm-1" >{project.site_host}</td>
        </tr>);  
    }
    return projects;    
  }

  onClickProjectHeader = (e) => {
    e.preventDefault();
    const status = e.target.getAttribute("status"),
          filterStatus = e.target.getAttribute("filterstatus");
    let statusState;
    if (status == "complete") {
      statusState = "showCompleted";
    } else if (status == "withdrawn") {
      statusState = "showWithdrawn";
    } else if (status == "upcoming") {
      if (filterStatus == 1) {
        statusState = "showHandleitUpcoming";
      } else {
        statusState = "showProjectUpcoming";
      }
    } else {
      if (filterStatus == 1) {
        statusState = "showHandleitInProgress";
      } else {
        statusState = "showProjectInProgress";
      }
    }
    this.setState(state => {
      return {
        [statusState]: !state[statusState]
      };
    });
  }

  onChangeCompleteYear = (e)=> {
    console.log(e.target.value);
    this.setState({
      selectedCompleteYear: e.target.value,
    });
  }

  /**
   * Create Table for projects
   * @param {*} status-projet.status[String]
   * @param {*} filterStatus 0 to not filter, 1 to filter out non-handleit, 
   *  2 to filter out handleit
   */
  createProjectTable = (title, status, filterStatus) => {
    const projectRows = this.createProjectRows(status, filterStatus);

    // Determine if state status on whether table should be shown
    let showStatus;
    if (status == "upcoming") {
      if (filterStatus == 1) {
        showStatus = this.state.showHandleitUpcoming;
      } else {
        showStatus = this.state.showProjectUpcoming
      }
    } else if (status == "in_progress") {
      if (filterStatus == 1) {
        showStatus = this.state.showHandleitInProgress;
      } else {
        showStatus =this.state.showProjectInProgress
      }
    } else if (status == "complete") {
      showStatus = this.state.showCompleted;
    } else {
      showStatus = this.state.showWithdrawn;
    }

    // show column only when both handleit & projects are showng
    let handleitColumn = (filterStatus == 0) ?
          (<th className="col-sm-1" scope="col">Handle-It</th>) : null;
    return (
      <div>
        <div>
          <h3>
            <a href="#" status={status} filterstatus={filterStatus}
                onClick={this.onClickProjectHeader}>{title}</a>  
          </h3>           
          {status == "complete" ? 
          (
            <select value={this.state.selectedCompleteYear}
                onChange={this.onChangeCompleteYear}>
              <option value={"all"}>All</option>
              {this.state.completeYears.map(year => {
                return (
                  <option key={year} value={year}>{year}</option>)
              })}
            </select>
          ): null}
        </div>
        
        {showStatus ? 
          (<table className="table">
            <thead>
              <tr>
                <th className="col-sm-2" scope="col">Project Name</th>
                { handleitColumn }
                <th className="col-sm-2" scope="col">Applicant</th>
                <th className="col-sm-2" scope="col">Location</th>
                <th className="col-sm-2" scope="col">Start Date</th>
                <th className="col-sm-1" scope="col">CC</th>
                <th className="col-sm-1" scope="col">PA</th>
                <th className="col-sm-1" scope="col">SH</th>
              </tr>
            </thead>
            <tbody>
              { projectRows }
            </tbody>
          </table>) : null
        }
        
      </div>);
  };

  render() {
    return (
      <div>
        <h2>Projects</h2>
        { this.createProjectTable("Handle-It: Upcoming", "upcoming", 1) }

        { this.createProjectTable("Handle-It: In Progress", "in_progress", 1)}

        { this.createProjectTable("Project: Upcoming", "upcoming", 2) }
        
        { this.createProjectTable("Project: In Progress", "in_progress", 2) }

        { this.createProjectTable("Completed", "complete", 0) }

        { this.createProjectTable("Withdrawn", "withdrawn", 0) }
      </div>
    );
  }
}

function loadReact() {
  ReactDOM.render(<AppProjects />, document.getElementById("projects_container"));
}

loadReact();