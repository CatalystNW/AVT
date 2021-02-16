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

  onClick_delete_all_projects = () => {
    var result = window.confirm("Are you sure you want to delete all projects?");
    if (result) {
      $.ajax({
        url: "./projects",
        type: "DELETE",
        success: function(data) {
          window.alert("All the projects were deleted");
        }
      })
    }
  }

  render() {
    let start;
    return (
    <div>
      <button type="button" onClick={this.onClick_delete_all_projects}>Delete Projects</button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Project Name</th>
            <th scope="col">Start Date</th>
            <th scope="col">Status</th>
            <th scope="col"># Work Items</th>
            <th scope="col">Link</th>
          </tr>
        </thead>
        <tbody>
          {this.state.projects.map((project)=> {
            start = project.start.replace("T", " ").substring(0, project.start.length - 8);
            return (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{start}</td>
              <td>{project.status}</td>
              <td>{project.workItems.length}</td>
              <td><a href={"./view_projects/"+ project._id}>{project._id}</a></td>
            </tr>);
          })}
        </tbody>
      </table>
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<AppProjects />, document.getElementById("projects_container"));
}

loadReact();