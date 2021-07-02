export { DocStatusBar }

class DocStatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationStatus: this.props.applicationStatus,
    };
  }

  onChangeStatus = (e) => {
    const status = e.target.value
    if (status == 'unknown') {
      window.alert("The option 'Unknown' isn't selectable.");
      return;
    }
    console.log(status);
    $.ajax({
      url: "/app_project/document/" + this.props.appId + "/status",
      type: "PATCH",
      context: this,
      data: {
        applicationStatus: status,
      },
      success: function(data) {
        this.setState({
          applicationStatus: status,
        });
      },
      error: function() {
        window.alert(`Unrecognized application status. 
                      Please contact the adminstrator with the status attempted.`);
      }
    });
  }

  createSelect = () => {
    const values = {
      'discuss': {text: 'On Hold - Pending Discussion' },
      'new': { text: 'NEW' },
      'phone': { text: 'Phone Call Needed' },
      'documents': { text: 'Awaiting Documents' },
      'assess': { text: 'Site Assessment - Pending' },
      'assessComp': { text: 'Site Assessment - Complete', noneditable: true},
      'declined': { text: 'Declined' },
      'withdrawnooa': { text: 'Withdrawn - Outside Service Area' },
      'withdrawn': { text: 'Withdrawn' },
      'vetted': { text: 'Application Vetted' },
      'waitlist': { text: 'Waitlist'},
      'transferred': { text: 'Transferred'},
      'unknown': {text: "Unknown"}

    };
    const status = (this.state.applicationStatus in values) ?
      this.state.applicationStatus : "unknown";
    if (status in values && values[status].noneditable) {
      return (<span>{values[status].text}</span>);
    } else if (!(status in values)) {
      return (<span>{status}</span>);
    }
    const options = [];
    for (let key in values) {
      if (!("noneditable" in values[key])|| !values[key].noneditable) {
        options.push(
          <option value={key} key={key}>{values[key].text}</option>)
      }
    }
    return (
      <select className="form-control" value={status}
        onChange={this.onChangeStatus}>
        {options}
      </select>
    );
  }

  render() {
    return (
    <div>
      <h4>Status</h4>
      {this.createSelect()}
    </div>);
  }
}