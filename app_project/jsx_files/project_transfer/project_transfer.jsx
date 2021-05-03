class ProjectTransferApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: assessment_id,
      // Work Items loaded via load_assessment
      proj_workitems: [],
      assessment: null,
      // Projects created by user on the page
      projects: [],
    }
    this.project_select_class = "project-select";
    this.load_assessment();
  }
  load_assessment = () => {
    var that = this;
    $.ajax({
      url: "/app_project/site_assessments/" + this.state.assessment_id,
      method: "GET",
      success: function(data) {
        console.log(data)
        let proj_workitems = [], workitem;
        for (var i=0; i< data.workItems.length; i++) {
          workitem = data.workItems[i];
          if (workitem.status == "accepted") {
            workitem.project = ""
            proj_workitems.push(workitem);
          }
        }
        
        that.setState({
          assessment: data,
          proj_workitems: proj_workitems,
        });
      },
    });
  }
  onChange_project_select = (e) => {
    var id = e.target.getAttribute("workitem_id");
    for(var i=0; i<this.state.proj_workitems.length; i++) {
      if (id == this.state.proj_workitems[i]._id) {
        this.setState((prev_state) => {
          prev_state.proj_workitems[i].project = e.target.value;
          return {project_workitems: prev_state.project_workitems}
        });
        break;
      }
    }
  }

  // Creates the select & option elements for the project options
  create_project_options = (workitem) => {
    return (
      <td>
        <select className={this.project_select_class}
          workitem_id={workitem._id}
          value={workitem.project}
          onChange={this.onChange_project_select}>
        {this.state.projects.map((project,index)=> {
          return (<option key={workitem._id + "-proj-" + index}>{project}</option>);
        })}
      </select></td>
    );
  }

  create_workItems = () => {
    var workitems = this.state.proj_workitems,
        keyname = "p-wi-";
    console.log(this.state.assessment);
    return (<table className="table">
      <thead>
        <tr>
          <th scope="col">Work Item Name</th>
          <th scope="col">Description</th>
          <th scope="col">Project Name</th>
        </tr>
      </thead>
      <tbody>
        {workitems.map((workitem) => {
          return (
            <tr key={keyname + workitem._id}>
              <td>{workitem.name}</td>
              <td>{workitem.description}</td>
              {this.create_project_options(workitem)}
            </tr>
          );
        })}
      </tbody>
    </table>);
  }

  onClick_create_project = () => {
    var name = window.prompt("Project Name");
    if (name != null && name.length > 0) {
      // Check if the project name already exists
      for (var i=0; i<this.state.projects.length; i++) {
        if (this.state.projects[i] === name) {
          window.alert("A project already exists with this name");
          return;
        }
      }

      this.setState({
        projects: [...this.state.projects, name],
      }, () => { // Assign project to workitems if it's the first one
        if (this.state.projects.length == 1) {
          for(var i=0; i<this.state.proj_workitems.length; i++) {
            this.state.proj_workitems[i].project = name;
          }
        }
      });
    }
  }
  transfer_project = () => {
    let projWorkItemObj = {},
        i;
    // Get project workitems
    for (i=0; i<this.state.proj_workitems.length; i++) {
      if (this.state.proj_workitems[i].project == null ||
        this.state.proj_workitems[i].project.length === 0){
          window.alert(`Work item ${this.state.proj_workitems[i].name}
            does not have a project name assigned to it.`
          );
          return;
        }

      projWorkItemObj[this.state.proj_workitems[i]._id] =
        this.state.proj_workitems[i].project;
    }
    $.ajax({
      url: "/app_project/project_transfer/" + this.state.assessment_id,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        project_workitems: projWorkItemObj,
      }),
      success: function(data) {
        window.location.replace("/app_project/project_transfer");
      }
    });
  }
  onClick_transfer = () => {
    // Check that all projects are assigned
    if (this.state.proj_workitems.length == 0) {
      window.alert("There aren't any work items in the site assessment.");
    } else if (this.state.proj_workitems.length > 0 && this.state.projects.length == 0) {
      window.alert("There are work items not assigned to a project. Create a project and assign work items to it.");
    } else {
      var result = window.confirm("Are you sure you want to transfer?");
      if (result) {
        this.transfer_project();
      }
    }
  }

  render() {
    let applicantHeader = (this.state.assessment != null) ?
        (<div className="row">
          <div className="col-md-8 col-lg-6">
            <table className="table table-sm">
              <tbody>
                <tr>
                  <th scope="row">Applicant Name</th>
                  <td>{this.state.assessment.documentPackage.application.name.first +
                    " " + this.state.assessment.documentPackage.application.name.last}</td>
                </tr>
                <tr>
                  <th scope="row">Location</th>
                  <td>{this.state.assessment.documentPackage.application.address.city}</td>
                </tr>
                <tr>
                  <th scope="row">Summary</th>
                  <td>{this.state.assessment.summary}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        ) : (null);

    return (<div>
      <h1>Project Work Items</h1>
      {applicantHeader}
      <div>
        <button className="btn btn-sm btn-outline-primary" type="button"
          onClick={this.onClick_transfer}>Transfer</button>
        <button className="btn btn-sm btn-outline-info" type="button"
          onClick={this.onClick_create_project}>Create Project</button>
      </div>
      {this.create_workItems(false)}
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<ProjectTransferApp />, document.getElementById("project_transfer_container"));
}

loadReact();