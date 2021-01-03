class ProjectTransferApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assessment_id: assessment_id,
      handleit_workitems: [],
      proj_workitems: []
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
        console.log(proj_workitems);
        console.log(handleit_workitems);
        
        that.setState({
          handleit_workitems: handleit_workitems,
          proj_workitems: proj_workitems,
        });
      },
    });
  }

  create_workItems = (handleit) => {
    var workitems = handleit ? 
      this.state.handleit_workitems : this.state.proj_workitems;
    return (<div>
      {workitems.map((workitem) => {
        return (
          <div>
            {workitem.name}
          </div>
        );
      })}
    </div>);
  }

  render() {
    return (<div>
      {this.create_workItems(true)}
      {this.create_workItems(false)}
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<ProjectTransferApp />, document.getElementById("project_transfer_container"));
}

loadReact();