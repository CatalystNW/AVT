class ProjectTransferApp extends React.Component {
  render() {
    return (<div>{assessment_id}</div>);
  }
}

function loadReact() {
  ReactDOM.render(<ProjectTransferApp />, document.getElementById("project_transfer_container"));
}

loadReact();