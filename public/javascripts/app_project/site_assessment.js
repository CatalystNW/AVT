// Note: app_id is a variable set by the page

var funkie = {
  load_application(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../application/"+app_id,
      success: function(data, textStatus, xhr) {
        if (callback)
          callback(data);
      }
    });
  },
  calculate_page_height() {
    return window.innerHeight - document.getElementById("cPart").offsetHeight
    - document.getElementById("navbarResponsive").offsetHeight - 40
    - document.getElementsByClassName("small")[0].offsetHeight;
  },
  get_assessment(app_id, callback) {
    console.log("GET")
    $.ajax({
      type: "GET",
      url: "../site_assessment/" + app_id,
      success: function(data, textStatus, xhr) {
        if (callback) {
          callback(data);
        }
      }
    });
  },
  create_workitem() {
    $("#modalMenu").modal("hide");
  }
}

class ModalMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      submit_form_callback: null,
      title: ""
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.submit_form_callback) {
      this.state.submit_form_callback();
    }
  }

  show_menu(type, submit_form_callback) {
    if (type == "create_workitem") {
      this.setState(
        {type: type, title: "Create WorkItem", submit_form_callback: submit_form_callback});
    }
  }

  create_menu() {
    if (this.state.type == "") {
      return <div></div>
    } else if (this.state.type == "create_workitem") {
      return (<div>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" name="name" id="name-input" required></input>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" name="description" id="desc-input" required></textarea>
        </div>
        <div className="form-group">
          <label>Assessment Comments</label>
          <textarea className="form-control" name="description" id="comments-input"></textarea>
        </div>
        <div className="form-check">
          <input type="checkbox" name="handleit" id="handleit-check"></input>
          <label className="form-check-label" htmlFor="handleit-check">Handle-It</label>
        </div>
      </div>);
    }
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" id="modalMenu">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {this.state.title}
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <form onSubmit={this.onSubmit}>
              <div className="modal-body">
                {this.create_menu()}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class AssessmentMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const divStyle = {
      height: funkie.calculate_page_height().toString() + "px",
    };

    return (
      <div className="col-sm-12 col-lg-6 overflow-auto" style={divStyle}
        id="assessment-container" key={this.props.id}>
          <h2>Work Items</h2>
          <button type="button" className="btn btn-primary" onClick={this.props.set_workitem_menu}
            data-toggle="modal" data-target="#modalMenu">
            Create Work Item
          </button>
        </div>
    )
  }
}

class ApplicationInformation extends React.Component {
  constructor(props) {
    super(props);
  }

  calculate_age = () => {
    const dob = new Date(this.props.application.dob.year, 
      this.props.application.dob.month, this.props.application.dob.date),
          d = new Date();
      var years = d.getFullYear() - dob.getFullYear();

      if (d.getMonth() < dob.getMonth() || 
        (d.getMonth() == dob.getMonth() && d.getDate() < dob.getDate() ))
        years--;

      return years;
  }

  render() {
    // set to browser height so that overflow will show both divs with scrollbars
    const divStyle = {
      height: funkie.calculate_page_height().toString() + "px",
    };
    var app = this.props.application;

    const name = app.middle_name == "" ?
      `${app.first_name} ${app.last_name}` :
      `${app.first_name} ${app.middle_name} ${app.last_name}`;
    const address = app.line_2 == "" ?
      <span>{app.line_1}<br />{app.city}, {app.state} {app.zip}</span> :
      <span>{app.line_1}<br />{app.line_2}<br />{app.city}, {app.state} {app.zip}</span>

    const owns_home = app.owns_home ? "Yes" : "No",
          can_contribute = app.client_can_contribute ? app.client_can_contribute_description : "No",
          ass_can_contribute = app.associates_can_contribute ? app.associates_can_contribute_description : "No";
          

    var google_url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyD2CmgnSECdg_g-aFgp95NUBv2QUEidDvs&q=";
    google_url += `${app.line_1} ${app.line_2}, ${app.city}, ${app.state}, ${app.zip}`;

    return (
      <div className="col-sm-12 col-lg-6 overflow-auto" style={divStyle}
        id="application-info-container">
          <ul className="nav nav-tabs" id="nav-app-tab" role="tablist">
            <a className="nav-item nav-link active" id="nav-app-tab" data-toggle="tab" 
                href="#nav-app-info" role="tab">Contact</a>
            <a className="nav-item nav-link" id="nav-property-tab" data-toggle="tab" 
                href="#nav-property-info" role="tab">Property</a>
            <a className="nav-item nav-link" id="nav-map-tab" data-toggle="tab" 
                href="#nav-map-info" role="tab">Map</a>
            
          </ul>

          <div className="tab-content" id="nav-app-tabContent">
            <div className="tab-pane show active" id="nav-app-info" role="tabpanel">
              <h2>Contact Info</h2>
              <table className="table">
                <tbody>
                  <tr><th className="col-xs-3">Name</th><td className="col-xs-9">{name}</td></tr>
                  <tr><th className="col-xs-3">Address</th><td className="col-xs-9">{address}</td></tr>
                  <tr><th className="col-xs-3">Phone</th><td className="col-xs-9">{app.phone}</td></tr>
                  <tr><th className="col-xs-3">Email</th><td className="col-xs-9">{app.email}</td></tr>
                  <tr>
                    <th className="col-xs-3">Emergency Contact</th>
                    <td className="col-xs-9">
                      {app.emergency_name}<br />{app.emergency_relationship}<br />{app.emergency_phone}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>Applicant Info</h2>
              <table className="table">
                <tbody>
                  <tr><th className="col-xs-3">Age</th><td className="col-xs-9">{this.calculate_age()}</td></tr>
                  <tr><th className="col-xs-3">Owns Home</th><td className="col-xs-9">{owns_home}<br /></td></tr>
                  <tr><th className="col-xs-3">Spouse</th><td className="col-xs-9">{app.spouse}</td></tr>
                  <tr>
                    <th className="col-xs-3">Other Residents</th>
                    <td className="col-xs-9">
                      {app.other_residents_names.map((name, index) => {
                        return <div key={"res-" + index}>{name} ({app.other_residents_age[index]}) - {app.other_residents_relationship[index]}</div>
                      })}
                    </td>
                  </tr>
                  <tr><th className="col-xs-3">Language</th><td className="col-xs-9">{app.language}<br /></td></tr>
                  <tr><th className="col-xs-3">Heard About</th><td className="col-xs-9">{app.heard_about}<br /></td></tr>
                </tbody>
              </table>
            </div>
            <div className="tab-pane" id="nav-property-info" role="tabpanel">
              <h2>Property Information</h2>
              <table className="table">
                <tbody>
                  <tr><th className="col-xs-3">Home Type</th><td className="col-xs-9">{app.home_type}</td></tr>
                  <tr><th className="col-xs-3">Ownership Length</th><td className="col-xs-9">{app.ownership_length}</td></tr>
                  <tr><th className="col-xs-3">Years Constructed</th><td className="col-xs-9">{app.year_constructed}</td></tr>
                  <tr><th className="col-xs-3">Requested Repairs</th><td className="col-xs-9">{app.requested_repairs}</td></tr>
                  <tr><th className="col-xs-3">Client Can Contribute</th><td className="col-xs-9">{can_contribute}</td></tr>
                  <tr><th className="col-xs-3">Assoc. Can Contribute</th><td className="col-xs-9">{ass_can_contribute}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="tab-pane" id="nav-map-info" role="tabpanel">
              <iframe width="100%" height="280" frameBorder="0"
                src={google_url} target="_blank">Google Maps Link</iframe>
            </div>
          </div>
          
        </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // both apps and assessments should be length 1, but use map to create them
      applications: [],
      assessments: [],
    }
    this.getAppData();
    this.getAssessment();
    
    this.modalmenu = React.createRef();
  }

  getAppData = () => {
    var that = this;
    funkie.load_application(app_id, function(data) {
      that.setState({applications: [data,]});
    });
  }

  getAssessment = () => {
    var that = this;
    funkie.get_assessment(app_id, function(data) {
      console.log(data.site_assessment);
      that.setState({assessments: [data.site_assessment,]});
    });
  }

  set_workitem_menu =() => {
    this.modalmenu.current.show_menu("create_workitem", funkie.create_workitem);
  }

  render() {
    const application_information = this.state.applications.map((application) => {
      return <ApplicationInformation key={application.id} 
        application={application}></ApplicationInformation>
    });

    const assessment_menu = this.state.assessments.map((assessment) => {
      console.log(assessment);
      return <AssessmentMenu 
        key={assessment._id} id={assessment._id}
        application_id={app_id} 
        set_workitem_menu={this.set_workitem_menu}
      />
    });
    return (
      <div>
        {assessment_menu}
        {application_information}

        <ModalMenu ref={this.modalmenu} />
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<App />, document.getElementById("site_assessment_container"));
}

loadReact();