class ProjectTransferApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: assessment_id,
    }
    this.load_assessment();
  }
  load_assessment = () => {
    $.ajax({
      url: "../site_assessment/" + this.state.assessment_id,
      method: "GET",
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
  ReactDOM.render(<ProjectTransferApp />, document.getElementById("project_transfer_container"));
}

loadReact();