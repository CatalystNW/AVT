class ProjectTransferApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: assessment_id,
      handleit_workitems: [],
      proj_workitems: [],
      projects: ["test", "test1"],
    }
    this.load_assessment();
  }
  load_assessment = () => {
    var that = this;
    $.ajax({
      url: "../site_assessment/" + this.state.assessment_id,
      method: "GET",
      success: function(data) {
        console.log(data)
        var handleit_workitems = [],
            proj_workitems = [], workitem;
        for (var i=0; i< data.workItems.length; i++) {
          workitem = data.workItems[i];
          if (workitem.status == "accepted") {
            if (workitem.handleit) {
              handleit_workitems.push(workitem);
            } else {
              proj_workitems.push(workitem);
            }
          }
        }
        
        that.setState({
          handleit_workitems: handleit_workitems,
          proj_workitems: proj_workitems,
        });
      },
    });
  }

  create_workItems = (handleit) => {
    var workitems = handleit ? 
      this.state.handleit_workitems : this.state.proj_workitems,
        keyname = handleit ? "h-wi-" : "p-wi-";
    return (<table className="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
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
              <td><select>
                {this.state.projects.map((project,index)=> {
                  return (<option key={workitem._id + "-proj-" + index}>{project}</option>);
                })}
                </select></td>
            </tr>
          );
        })}
      </tbody>
    </table>);
  }

  render() {
    return (<div>
      <h2>Handle-It Work Items</h2>
      {this.create_workItems(true)}
      <h2>Project Work Items</h2>
      {this.create_workItems(false)}
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<ProjectTransferApp />, document.getElementById("project_transfer_container"));
}

loadReact();