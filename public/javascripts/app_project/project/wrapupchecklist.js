class WrapupChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.load_checklist();
  }

  load_checklist = () => {
    $.ajax({
      url: "../projects/" + this.props.project_id + "/wrapup_checklist",
      type: "GET",
      context: this,
      success: function(checklist_data) {
        console.log(checklist_data)
        this.setState({
          checklist: checklist_data,
        });
      },
    });
  }

  render() {
    return (<div>Hi</div>);
  }
}