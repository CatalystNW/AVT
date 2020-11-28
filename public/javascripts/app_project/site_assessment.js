var funkie = {
  load_application(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../application/"+app_id,
      success: function(data, textStatus, xhr) {
        if (callback)
          callback(data);
      }
    })
  },
}

class ApplicationInformation extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.application);
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
      height: (window.innerHeight - document.getElementById("cPart").offsetHeight
        - document.getElementById("navbarResponsive").offsetHeight - 40
        - document.getElementsByClassName("small")[0].offsetHeight).toString() + "px",
    }
    var app = this.props.application;

    const name = app.middle_name == "" ?
      `${app.first_name} ${app.last_name}` :
      `${app.first_name} ${app.middle_name} ${app.last_name}`;
    const address = app.line_2 == "" ?
      <span>{app.line_1}<br />{app.city}, {app.state} {app.zip}</span> :
      <span>{app.line_1}<br />{app.line_2}<br />{app.city}, {app.state} {app.zip}</span>

    const owns_home = app.owns_home ? "Yes" : "No";

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
                </tbody>
              </table>
            </div>
            <div class="tab-pane" id="nav-map-info" role="tabpanel">
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
      applications: [],
    }
    this.getAppData();
  }

  getAppData = () => {
    var that = this;
    funkie.load_application(app_id, function(data) {
      that.setState({applications: [data,]});
    });
  }

  render() {
    const application_information = this.state.applications.map((application) => {
      return <ApplicationInformation key={application.id} 
        application={application}></ApplicationInformation>
    });
    return (
      <div>
        <div className="col-sm-12 col-lg-6 overflow-auto" id="application-input-container"></div>
        {application_information}
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<App />, document.getElementById("site_assessment_container"));
}

loadReact();