export { CurrentProjects }

import { functionHelper } from "../functionHelper.js"

class CurrentProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      handleits: [],
    }
    this.projectTableId = "project-table";
    this.handleitTableId = "handleit-table";
    this.loadData();
  }

  loadData = () => {
    $.ajax({
      url: "/app_project/report/current",
      type: "GET",
      context: this,
      success: function(projectsData) {
        console.log(projectsData);
        let projects = [],
            handleits = [];

        projectsData.forEach(project => {
          // Convert project.start from date string to date object
          if (project.start) {
            project.start = functionHelper.convert_date(project.start);
          }

          if (project.handleit) {
            handleits.push(project);
          } else {
            projects.push(project);
          }
        });
        // Sort projects by project.start
        projects.sort(functionHelper.date_sorter);
        handleits.sort(functionHelper.date_sorter);

        this.setState({
          projects: projects,
          handleits: handleits,
        });
      }
    });
  };

  onClick_exportHandleitCSV = () => {
    const projectDataArray = functionHelper.getTableText(this.handleitTableId);
    functionHelper.exportCSV("upcoming-handleits-", projectDataArray);
  };
  onClick_exportProjectCSV = () => {
    const projectDataArray = functionHelper.getTableText(this.projectTableId);
    functionHelper.exportCSV("upcoming-projects-", projectDataArray);
  };
  onClick_combinedProjectsCSV = () => {
    let projectDataArray = [["Handle-It"]].concat(functionHelper.getTableText(this.handleitTableId));

    projectDataArray = projectDataArray.concat([["Projects"]], functionHelper.getTableText(this.projectTableId));
    functionHelper.exportCSV("upcoming-combined-projects-", projectDataArray);
  };

  exportCSV = (filename, dataArray) => {
    let csvContent = "data:text/csv;charset=utf-8," +
        dataArray.map(row => row.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    let dateString = new Date().toISOString().replace(/T.*/,'');
    link.setAttribute("download", filename + dateString + ".csv")
    document.body.appendChild(link);
    link.click();
  };

  render() {
    return (
      <div>
        <h1>Current Projects</h1>
        <span>
          <label className="m-1">Download CSV: </label>
          <button className="btn btn-sm btn-primary"
              onClick={this.onClick_combinedProjectsCSV}>Combined</button>
          <button className="btn btn-sm btn-secondary"
              onClick={this.onClick_exportHandleitCSV}>Handle-it</button>
          <button className="btn btn-sm btn-success"
            onClick={this.onClick_exportProjectCSV}>Project</button>
        </span>
        <h2>Handle-It Projects</h2>
        {functionHelper.createTable(this.handleitTableId, this.state.handleits)}
        <h2>Projects</h2>
        {functionHelper.createTable(this.projectTableId, this.state.projects)}
      </div>
    )
  }
}