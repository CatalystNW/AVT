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
   * @param {*} handleit-Will filter handleit/projects
   *  project.handleit["yes", "no", "all"]
   */
  createProjectRows = (status, handleit) => {
    const projects = [];
    let project, start, doc, app, address;
    for (let i=0; i< this.state.projects.length; i++) {
      project = this.state.projects[i];
      if (project.status != status )
        continue;
      if (handleit == "no" && project.handleit ||
          handleit == "yes" && !project.handleit) {
        continue;
      }
      start = project.start.replace("T", " ").substring(0, project.start.length - 8);
      doc = project.documentPackage;
      app = doc.application;
      // address = (app.address.line_2) ? app.address.line_1 + " " + app.address.line_2 : app.address.line_1;
      address = `${app.address.city}, ${app.address.state}`
      projects.push(
        <tr key={project._id}>
          <td>
            <a href={"./view_projects/"+ project._id}>{app.name.first} {app.name.last}</a>
          </td>
          <td>{address}</td>
          <td>{project.name}</td>
          <td>{start}</td>
          <td>{project.crew_chief}</td>
          <td>{project.project_advocate}</td>
          <td>{project.site_host}</td>
        </tr>);  
    }
    return projects;    
  }

  /**
   * Create Table for projects
   * @param {*} status-projet.status[String]
   * @param {*} handleit-Will filter handleit/projects
   *  project.handleit["yes", "no", "all"]
   */
  createProjectTable = (title, status, handleit) => {
    const projectRows = this.createProjectRows(status, handleit);
    return (
      <div>
        <h2>{title}</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Location</th>
              <th scope="col">Project Name</th>
              <th scope="col">Start Date</th>
              <th scope="col">CC</th>
              <th scope="col">PA</th>
              <th scope="col">SH</th>
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
        {this.createProjectTable("Handle-It: Upcoming", "upcoming", "yes")}
        {this.createProjectTable("Project: Upcoming", "upcoming", "no")}
        {this.createProjectTable("Handle-It: In Progress", "in_progress", "yes")}
        {this.createProjectTable("Project: In Progress", "in_progress", "no")}
        {this.createProjectTable("Completed", "complete", "all")}
        {this.createProjectTable("Withdrawn", "withdrawn", "all")}
      </div>
    );
  }
}

function loadReact() {
  ReactDOM.render(<AppProjects />, document.getElementById("projects_container"));
}

loadReact();