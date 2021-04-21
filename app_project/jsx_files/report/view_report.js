import { UpcomingProjects } from "./upcoming_projects.js"
import { ProjectReport } from "./project_report.js"

class ReportApp extends React.Component {
  constructor(props) {
    super(props);
  }

  createTabs = () => {
    return (
      //<div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#upcomingReport" role="tab" data-toggle="tab">Upcoming Projects</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#project-report" role="tab" data-toggle="tab">Projects</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" role="tab" data-toggle="tab">Applications</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" role="tab" data-toggle="tab">Search</a>
          </li>
        </ul>
      //</div>
    )
  };
  
  createPages = () => {
    return (
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane show active" id="upcomingReport" role="tabpanel" aria-labelledby="home-tab">
          <UpcomingProjects />
        </div>
        <div className="tab-pane" id="project-report" role="tabpanel" aria-labelledby="profile-tab">
          <ProjectReport />
        </div>
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