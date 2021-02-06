import { ProjectNotes } from "./components/project/projectnotes.js"

export { ApplicationInformation }

class ApplicationInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      site_assessment: null,
    }
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

  get_site_assessment = () => {
    funkie.get_assessment(this.props.assessment_id, (data)=> {
      console.log(data);
      this.setState({
        site_assessment: data,
      });
    });
  }

  create_assessment_page = () => {
    if (this.state.site_assessment == null) {
      this.get_site_assessment();
      return (<div></div>);
    } else {
      var assessment = this.state.site_assessment;
      return (
        <div>
          <h3>Info</h3>
          <table className="table table-sm">
            <tbody>
              <tr>
                <th scope="row" className="col-xs-6 col-md-4">
                  Summary
                </th>
                <td className="col-xs-6 col-xs-8">
                  {assessment.summary}
                </td>
              </tr>
              <tr>
                <th scope="row" className="col-xs-6 col-md-4">
                  Lead
                </th>
                <td className="col-xs-6 col-xs-8">
                  {assessment.lead}
                </td>
              </tr>
              <tr>
                <th scope="row" className="col-xs-6 col-md-4">
                  Asbestos
                </th>
                <td className="col-xs-6 col-xs-8">
                  {assessment.asbestos}
                </td>
              </tr>
              <tr>
                <th scope="row" className="col-xs-6 col-md-4">
                  Safety Plan
                </th>
                <td className="col-xs-6 col-xs-8">
                  {assessment.safety_plan}
                </td>
              </tr>
              <tr>
                <th scope="row" className="col-xs-6 col-md-4">
                  Waste Dumpster
                </th>
                <td className="col-xs-6 col-xs-8">
                  <div>Required : {assessment.waste_required ? "Yes" : "No"}</div>
                  <div>Cost: {assessment.waste_cost}</div>
                </td>
              </tr>
              <tr>
                <th scope="row" className="col-xs-6 col-md-4">
                  Porta Potty
                </th>
                <td className="col-xs-6 col-xs-8">
                  <div>Required : {assessment.porta_potty_required ? "Yes" : "No"}</div>
                  <div>Cost: {assessment.porta_potty_cost}</div>
                </td>
              </tr>
              <tr>
                <th scope="row" className="col-xs-6 col-md-4">
                  Google Drive
                </th>
                <td className="col-xs-6 col-xs-8">
                  {assessment.drive_url ? 
                    <a href={assessment.drive_url} target="_blank">URL</a> :
                    ""
                  }
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      );
    }
  };

  render() {
    var app = this.props.application;
    if (app === null) {
      return (<div></div>);
    }

    var assessment_tab, assessment_page, application_page,
        property_page, property_tab, proj_note_tab, proj_note_page;
    if (this.props.view_type && this.props.view_type == "project") {
      assessment_tab = (<a className="nav-item nav-link" id="nav-site-assessment-tab" data-toggle="tab" 
            href="#nav-site-assessment" role="tab">Assessment</a>);

      assessment_page = this.create_assessment_page();

      // Split application page into two tabs for assessment. Combine for projects
      application_page = (
        <div className="tab-pane" id="nav-app-info" role="tabpanel">
          {this.create_applicant_info_page()}
          {this.create_property_page()}
        </div>
      );

      proj_note_tab = (
        <a className="nav-item nav-link active" id="nav-proj-note-tab" data-toggle="tab" 
            href="#nav-proj-note" role="tab">Notes</a>);
      proj_note_page = (
        <div className="tab-pane show active" id="nav-proj-note" role="tabpanel">
          <ProjectNotes project_id={this.props.project_id}/>
        </div>
      );
    } else {
      application_page = (
          <div className="tab-pane show active" id="nav-app-info" role="tabpanel">
            {this.create_applicant_info_page()}
          </div>
      );
      property_tab = (
        <a className="nav-item nav-link" id="nav-property-tab" data-toggle="tab" 
            href="#nav-property-info" role="tab">Property</a>
      )
      property_page = (
        <div className="tab-pane" id="nav-property-info" role="tabpanel">
          {this.create_property_page()}
        </div>
      );
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
            <ul className="nav nav-tabs " id="nav-app-tab" role="tablist">
              <a className="nav-item nav-link" id="nav-app-tab" data-toggle="tab" 
                href="#nav-app-info" role="tab">Application</a>
              { property_tab }
              { assessment_tab }
              <a className="nav-item nav-link" id="nav-map-tab" data-toggle="tab" 
                  href="#nav-map-info" role="tab">Map</a>
              { proj_note_tab }
            </ul>
          </div>

          <div className="tab-content overflow-auto" id="nav-app-tabContent">
            { application_page }
            { property_page }
            <div className="tab-pane" id="nav-site-assessment" role="tabpanel">
              {assessment_page}
            </div>
            <div className="tab-pane" id="nav-map-info" role="tabpanel">
              <iframe width="100%" height="280" frameBorder="0"
                src={google_url} target="_blank">Google Maps Link</iframe>
            </div>
            { proj_note_page }
          </div>
          
        </div>
    )
  }
}