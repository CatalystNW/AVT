export { UpcomingProjects }

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
          if (project.start)
            project.start = this.convert_date(project.start);
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

  convert_date(old_date) {
    let regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      let [year, month, date, hours, minutes] = result.slice(1,6);
      return new Date(Date.UTC(year, parseInt(month)-1  , date, hours, minutes));
    }
    return null;
  }

  roundCurrency(n) {
    let mult = 100, value;
    value = parseFloat((n * mult).toFixed(6))
    return Math.round(value) / mult;
  }

  createTable = (id, projects) => {
    return (
      <table className="table table-sm" id={id}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Start Date</th>
            <th scope="col">Location</th>
            <th scope="col">Work Items</th>
            <th scope="col">Home Type</th>
            <th scope="col">CC</th>
            <th scope="col">PA</th>
            <th scope="col">SH</th>
            <th scope="col">Partners</th>
            <th scope="col">Volunteers</th>
            <th scope="col">Cost</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            let cost = 0, volunteers = 0;
            project.workItems.forEach(workItem => {
              workItem.materialsItems.map(materialsItem => {
                cost += materialsItem.price * materialsItem.quantity;
              });
              volunteers += workItem.volunteers_required;
            });
            return (
              <tr key={project._id}>
                <td>
                  <a href={"/app_project/view_projects/" + project._id} target="_blank">{project.documentPackage.application.name.first 
                      + " " + project.documentPackage.application.name.last}</a>
                </td>
                <td>
                  { (project.start) ? project.start.toLocaleDateString() : "None"}
                </td>
                <td>
                  {project.documentPackage.application.address.city}
                </td>
                <td>
                  {project.workItems.map((workItem, index) => {
                    return (
                    <div key={project._id + "_" + workItem._id}>
                      {index + ". " + workItem.name}</div>);
                  })}
                </td>
                <td>{project.documentPackage.property.home_type}</td>
                <td>{project.crew_chief ? project.crew_chief : "N/A"}</td>
                <td>{project.project_advocate ? project.project_advocate : "N/A"}</td>
                <td>{project.site_host ? project.site_host : "N/A"}</td>
                <td>
                  {project.partners.map(partner => {
                    return (<div key={project._id + "_" + partner._id}>{partner.org_name}</div>)
                  })}
                </td>
                <td>{volunteers}</td>
                <td>{this.roundCurrency(cost).toFixed(2)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
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
    const projectDataArray = this.getTableText(this.handleitTableId);
    this.exportCSV("upcoming-handleits-", projectDataArray);
  };
  onClick_exportProjectCSV = () => {
    const projectDataArray = this.getTableText(this.projectTableId);
    this.exportCSV("upcoming-projects-", projectDataArray);
  };
  onClick_combinedProjectsCSV = () => {
    let projectDataArray = [["Handle-It"]].concat(this.getTableText(this.handleitTableId));

    projectDataArray = projectDataArray.concat([["Projects"]], this.getTableText(this.projectTableId));
    this.exportCSV("upcoming-combined-projects-", projectDataArray);
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
        {this.createTable(this.handleitTableId, this.state.handleits)}
        <h2>Projects</h2>
        {this.createTable(this.projectTableId, this.state.projects)}
      </div>
    )
  }
}