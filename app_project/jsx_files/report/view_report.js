import { UpcomingProjects } from "./upcoming_projects.js"

class ReportApp extends React.Component {
  constructor(props) {
    super(props);
  }

  createTabs = () => {
    return (
      <div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#upcomingReport">Upcoming Projects</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Projects</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Applications</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Search</a>
          </li>
        </ul>
      </div>
    )
  };
  
  createPages = () => {
    return (
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane show active" id="upcomingReport" role="tabpanel" aria-labelledby="home-tab">
          <UpcomingProjects />
        </div>
        <div className="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
        <div className="tab-pane" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
      </div>
    );
  };

  render() {
    return (<div>
      {this.createTabs()}

      {this.createPages()}
    </div>)
  }
}

function loadReact() {
  ReactDOM.render(<ReportApp />, document.getElementById("mainContainer"));
}

loadReact();