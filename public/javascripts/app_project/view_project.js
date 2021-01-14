class AppProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
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