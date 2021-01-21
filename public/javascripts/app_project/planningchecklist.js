class PlanningChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.load_checklist();
  }

  load_checklist = () => {
    $.ajax({
      url: "../projects/" + this.props.project_id + "/plan_checklist",
      type: "GET",
      success: function(data) {
        console.log(data);
      },
    });
  };

  render() {
    return (<div>
      {this.props.project_id}
    </div>);
  }
}