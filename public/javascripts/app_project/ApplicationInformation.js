class ApplicationInformation extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $("#nav-app-tabContent").css(
        "padding-top", $("#application-info-nav-container").height());
    $("#application-info-nav-container").css(
      "width", $("#nav-app-tabContent").width());
  }

  componentDidUpdate() {
    $("#nav-app-tabContent").css(
      "padding-top", $("#application-info-nav-container").height());
    $("#application-info-nav-container").css(
      "width", $("#nav-app-tabContent").width());
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
  };

  create_applicant_info_page = () => {
    const app = this.props.application;
    const address = app.line_2 == "" ?
      <span>{app.line_1}<br />{app.city}, {app.state} {app.zip}</span> :
      <span>{app.line_1}<br />{app.line_2}<br />{app.city}, {app.state} {app.zip}</span>
    const owns_home = app.owns_home ? "Yes" : "No";
      
    return (
      <div>
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

        <h3>Applicant Info</h3>
        <table className="table">
          <tbody>
            <tr>
              <th className="col-xs-3">Age</th>
              <td className="col-xs-9">{this.calculate_age()}</td>
            </tr>
            <tr>
              <th className="col-xs-3">Owns Home</th>
              <td className="col-xs-9">{owns_home}<br /></td>
            </tr>
            <tr>
              <th className="col-xs-3">Spouse</th>
              <td className="col-xs-9">{app.spouse}</td>
            </tr>
            <tr>
              <th className="col-xs-3">Other Residents</th>
              <td className="col-xs-9">
                {app.other_residents_names.map((name, index) => {
                  return <div key={"res-" + index}>{name} ({app.other_residents_age[index]}) - {app.other_residents_relationship[index]}</div>
                })}
              </td>
            </tr>
            <tr>
              <th className="col-xs-3">Language</th>
              <td className="col-xs-9">{app.language}<br /></td>
            </tr>
            <tr>
              <th className="col-xs-3">Heard About</th>
              <td className="col-xs-9">{app.heard_about}<br /></td>
            </tr>
          </tbody>
        </table>
      </div>);
  }

  create_property_page = () => {
    const app = this.props.application;
    const can_contribute = app.client_can_contribute ? app.client_can_contribute_description : "No",
          ass_can_contribute = app.associates_can_contribute ? app.associates_can_contribute_description : "No";

    return (
      <div>
        <h3>Property Information</h3>
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
    );
  }

  render() {
    var app = this.props.application;
    if (app === null) {
      return (<div></div>);
    }

    // set to browser height so that overflow will show both divs with scrollbars
    const divStyle = {
      height: funkie.calculate_page_height().toString() + "px",
    };

    const name = app.middle_name == "" ?
      `${app.first_name} ${app.last_name}` :
      `${app.first_name} ${app.middle_name} ${app.last_name}`;

    var google_url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyD2CmgnSECdg_g-aFgp95NUBv2QUEidDvs&q=";
    google_url += `${app.line_1} ${app.line_2}, ${app.city}, ${app.state}, ${app.zip}`;

    return (
      <div className="col-sm-12 col-lg-4" style={divStyle}
        id="application-info-container">
          <div id="application-info-nav-container">
            <h2>{name}</h2>
            <ul className="nav nav-tabs" id="nav-app-tab" role="tablist">
              <a className="nav-item nav-link active" id="nav-app-tab" data-toggle="tab" 
                  href="#nav-app-info" role="tab">Contact</a>
              <a className="nav-item nav-link" id="nav-property-tab" data-toggle="tab" 
                  href="#nav-property-info" role="tab">Property</a>
              <a className="nav-item nav-link" id="nav-map-tab" data-toggle="tab" 
                  href="#nav-map-info" role="tab">Map</a>
            </ul>
          </div>

          <div className="tab-content overflow-auto" id="nav-app-tabContent">
            <div className="tab-pane show active" id="nav-app-info" role="tabpanel">
              {this.create_applicant_info_page()}
            </div>
            <div className="tab-pane" id="nav-property-info" role="tabpanel">
              {this.create_property_page()}
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