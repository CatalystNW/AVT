class AppProjects extends React.Component {
  constructor(props) {
    super(props);
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

  render() {
    return (<div></div>);
  }
}

function loadReact() {
  ReactDOM.render(<AppProjects />, document.getElementById("projects_container"));
}

loadReact();