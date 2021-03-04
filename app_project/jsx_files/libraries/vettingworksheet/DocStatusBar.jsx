export { DocStatusBar }

class DocStatusBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
    };
    this.loadStatus();
  }

  loadStatus = () => {
    if (this.props.status == null) {
      console.log(this.props.status);
    }
  };

  onChangeStatus = (e) => {
    $.ajax({
      url: "/app_project/document/" + this.props.appId + "/status",
      type: "PATCH",
      context: this,
      data: {
        status: e.target.value,
      },
      success: function(data) {
        this.setState({
          status: data.status,
        });
      }
    });
  }

  createSelect = () => {
    const values = {
      'discuss': { value: 'discuss', text: 'On Hold - Pending Discussion' },
      'new': { value: 'new', text: 'NEW' },
      'phone': { value: 'phone', text: 'Phone Call Needed' },
      'handle': { value: 'handle', text: 'Handle-It' },
      'documents': { value: 'documents', text: 'Awaiting Documents' },
      'assess': { value: 'assess', text: 'Site Assessment - Pending' },
      'assessComp': { value: 'assessComp', text: 'Site Assessment - Complete', noneditable: true},
      'approval': { value: 'approval', text: 'Application Approval Process' },
      'declined': { value: 'declined', text: 'Declined' },
      'withdrawnooa': { value: 'withdrawnooa', text: 'Withdrawn - Outside Service Area' },
      'withdrawn': { value: 'withdrawn', text: 'Withdrawn' },
      'project': { value: 'project', text: 'Approved Project' },
      'waitlist': { value: 'waitlist', text: 'Waitlist'},
      'transferred': { value: 'transferred', text: 'Transferred'}
    };
    const status = this.state.status;
    if (values[status].noneditable) {
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
      <select value={this.state.status}
        onChange={this.onChangeStatus}>
        {options}
      </select>
    );
  }

  render() {
    return (<div>
      Status: 
      {this.createSelect()}
    </div>);
  }
}