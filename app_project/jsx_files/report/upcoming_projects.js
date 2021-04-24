export { UpcomingProjects }

import { functionHelper } from "./functionHelper.js"

class UpcomingProjects extends React.Component {
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
      url: "/app_project/report/upcoming",
      type: "GET",
      context: this,
      success: function(projectsData) {
        let projects = [],
            handleits = [];

        console.log(projectsData)

        projectsData.forEach(project => {
          if (project.handleit) {
            projects.push(project);
          } else {
            handleits.push(project);
          }
        });
        this.setState({
          projects: projects,
          handleits: handleits,
        });
      }
    });
  };

  getTableText = (tableId) => {
    const table = document.getElementById(tableId);
    const projectDataArray = [];
    for(let r = 0; r < table.rows.length; r++) {
      projectDataArray.push([]);
      for (let c = 0; c < table.rows[r].cells.length; c++) {
        projectDataArray[r].push(table.rows[r].cells[c].innerText.replace(/\n/ig, "; "));
      }
    }
    return projectDataArray;
  }

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

    projectDataArray = projectDataArray.concat([["Projects"]], this.getTableText(this.projectTableId));
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
        <h1>Upcoming Projects</h1>
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