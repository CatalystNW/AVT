class AppProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
    };
    this.load_project();
  }

  load_project() {
    if (project_id) {
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        success: function(data) {
          console.log(data);
        }
      })
    }
  }

  render() {
    return (
    <div>
      HI
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<AppProject />, document.getElementById("project_container"));
}

loadReact();