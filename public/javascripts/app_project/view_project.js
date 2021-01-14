class AppProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      application: null,
    };
    this.load_project();
  }

  load_project() {
    if (project_id) {
      var that = this;
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        success: function(data) {
          console.log(data);
          that.load_application_data(data.documentPackage);
        }
      });
    }
  }

  load_application_data(documentPackage_id) {
    var that = this;
    $.ajax({
      url: "/app_project/application/" + documentPackage_id,
      type: "GET",
      success: function(app_data) {
        that.setState({application: app_data});
      }
    })
  }

  render() {
    return (
    <div>
      <ApplicationInformation
        application={this.state.application} 
      />
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<AppProject />, document.getElementById("project_container"));
}

loadReact();