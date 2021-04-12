class AppProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    }
    this.get_projects();
  }

  get_projects = () => {
    var that = this;
    $.ajax({
      url: "./projects",
      type: "GET",
      success: function(data) {
        console.log(data);
        that.setState({projects: data,})
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
    let project, start, doc, app, address, handleitColumn;
    
    for (let i=0; i< this.state.projects.length; i++) {
      project = this.state.projects[i];
      if (project.status != status )
        continue;
      if (filterStatus == 2 && project.handleit ||
          filterStatus == 1 && !project.handleit) {
        continue;
      }
      if (project.start)
        start = project.start.replace("T", " ").substring(0, project.start.length - 8);
      doc = project.documentPackage;
      app = doc.application;
      address = `${app.address.city}, ${app.address.state}`;
      // show column only when both handleit & projects are shown
      handleitColumn = (filterStatus == 0) ?
          (<td className="col-sm-1" >{(project.handleit) ? "✔️" : ""}</td>) : null;
      projects.push(
        <tr key={project._id}>
          <td className="col-sm-2" >{project.name}</td>
          { handleitColumn }
          <td className="col-sm-2" >
            <a href={"./view_projects/"+ project._id}>{app.name.first} {app.name.last}</a>
          </td>
          <td className="col-sm-2" >{address}</td>
          <td className="col-sm-2" >{start}</td>
          <td className="col-sm-1" >{project.crew_chief}</td>
          <td className="col-sm-1" >{project.project_advocate}</td>
          <td className="col-sm-1" >{project.site_host}</td>
        </tr>);  
    }
    return projects;    
  }

  /**
   * Create Table for projects
   * @param {*} status-projet.status[String]
   * @param {*} filterStatus 0 to not filter, 1 to filter out non-handleit, 
   *  2 to filter out handleit
   */
  createProjectTable = (title, status, filterStatus) => {
    const projectRows = this.createProjectRows(status, filterStatus);
    // show column only when both handleit & projects are showng
    let handleitColumn = (filterStatus == 0) ?
          (<th className="col-sm-1" scope="col">Handle-It</th>) : null;
    return (
      <div>
        <h2>{title}</h2>
        <table className="table">
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
        </table>
      </div>);
  };

  render() {
    return (
      <div>
        {this.createProjectTable("Handle-It: Upcoming", "upcoming", 1)}
        {this.createProjectTable("Project: Upcoming", "upcoming", 2)}
        {this.createProjectTable("Handle-It: In Progress", "in_progress", 1)}
        {this.createProjectTable("Project: In Progress", "in_progress", 2)}
        {this.createProjectTable("Completed", "complete", 0)}
        {this.createProjectTable("Withdrawn", "withdrawn", 0)}
      </div>
    );
  }
}

function loadReact() {
  ReactDOM.render(<AppProjects />, document.getElementById("projects_container"));
}

loadReact();