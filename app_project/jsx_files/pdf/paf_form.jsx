class PAFApp extends React.Component {
  constructor(props) {
    super(props);
    this.getProject();
  }

  getProject = () => {
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      success: function(data) {
        console.log(data);
      }
    })
  }

  render() {
    return (<div>{project_id}</div>);
  }
}


function loadReact() {
  ReactDOM.render(<PAFApp />, document.getElementById("pdf_container"));
}

loadReact();