export {functionHelper}

const functionHelper = {
  convert_date(old_date) {
    let regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      let [year, month, date, hours, minutes] = result.slice(1,6);
      return new Date(Date.UTC(year, parseInt(month)-1  , date, hours, minutes));
    }
    return null;
  },

  // Sort by project.start
  date_sorter(a, b) {
    if (!a.start) {
      return 1;
    } else if (!b.start) {
      return -1;
    }
    return b.start.getTime() - a.start.getTime();
  },

  getTableText(tableId) {
    const table = document.getElementById(tableId);
    const projectDataArray = [];
    for(let r = 0; r < table.rows.length; r++) {
      projectDataArray.push([]);
      for (let c = 0; c < table.rows[r].cells.length; c++) {
        projectDataArray[r].push(table.rows[r].cells[c].innerText.replace(/\n/ig, "; "));
      }
    }
    return projectDataArray;
  },
  exportCSV(filename, dataArray) {
    let csvContent = "data:text/csv;charset=utf-8," +
        dataArray.map(row => row.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    let dateString = new Date().toISOString().replace(/T.*/,'');
    link.setAttribute("download", filename + dateString + ".csv")
    document.body.appendChild(link);
    link.click();
  },

  roundCurrency(n) {
    let mult = 100, value;
    value = parseFloat((n * mult).toFixed(6))
    return Math.round(value) / mult;
  },
  createTable(id, projects, complete=false) {
    return (
      <table className="table table-sm" id={id}>
        <thead>
          <tr>
            <th scope="col">Project Name</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Handle-It</th>
            <th scope="col">Start Date</th>
            <th scope="col">Location</th>
            <th scope="col">Work Items</th>
            <th scope="col">Home Type</th>
            <th scope="col">CC</th>
            <th scope="col">PA</th>
            <th scope="col">SH</th>
            <th scope="col">Partners</th>
            <th scope="col">{ complete ? "Volunteers" : "Volunteers Needed"}</th>
            <th scope="col">{ complete ? "Cost" : "Estimated Cost"}</th>
            <th scope="col">Hours</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            let cost = 0, volunteers = 0, hours = project.volunteer_hours;;
            project.workItems.forEach(workItem => {
              workItem.materialsItems.map(materialsItem => {
                cost += materialsItem.price * materialsItem.quantity;
              });
              volunteers += workItem.volunteers_required;
            });
            let start_date;
            if (project.start) {
              if (typeof project.start == "string") {
                start_date = functionHelper.convert_date(project.start).toLocaleDateString();
              } else {
                start_date = project.start.toLocaleDateString();
              }
            } else {
              start_date = "None";
            }
            return (
              <tr key={project._id}>
                <td>
                  { !project.name || project.name.length == 0 ?
                    (<a href={"/app_project/view_projects/" + project._id} target="_blank">
                      N/A
                    </a>) :
                    (<a href={"/app_project/view_projects/" + project._id} target="_blank">
                      {project.name}
                    </a>)
                  }
                </td>
                <td>
                  <a href={"/view/" + project.documentPackage._id} target="_blank">
                    {project.documentPackage.application.name.first 
                      + " " + project.documentPackage.application.name.last}</a>
                </td>
                <td>{project.status}</td>
                <td>
                  {project.handleit ? "Y": "N"}
                </td>
                <td>
                  {start_date}
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
                <td>{functionHelper.roundCurrency(cost).toFixed(2)}</td>
                <td>{hours}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  },
  get_data (formId) {
    var data = {};
    var formData = new FormData($("#" + formId)[0]);

    for (var key of formData.keys()) {
      data[key] = formData.get(key);
    }
    return data;
  }
};