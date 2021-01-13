class AppProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    }
    this.get_projects();
  }

  get_projects = () => {
    $.ajax({
      url: "./projects",
      type: "GET",
      success: function(data) {
        console.log(data);
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
          console.log("deleted");
        }
      })
    }
  }


  render() {
    return (
    <div>
      <button type="button" onClick={this.onClick_delete_all_projects}>Delete Projects</button>
      <table></table>
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<AppProjects />, document.getElementById("projects_container"));
}

loadReact();