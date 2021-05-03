class PAFApp extends React.Component {
  constructor(props) {
    super(props);
    // this.hide_elements();
    this.state = this.getState();
  }

  // Get work items from props and return an array of non-decliend ones
  getState = () => {
    let workitems, data;
    if (this.props.type == "project") {
      data = this.props.projectData;
    } else if (this.props.type == "assessment") {
      data = this.props.assessmentData;
    } else {
      return;
    }
    workitems = data.workItems;

    let filteredWorkitems = [];
    workitems.forEach(workitem => {
      if (workitem.status != "declined") {
        filteredWorkitems.push(workitem);
      }
    });
    return {
      workitems: filteredWorkitems,
      porta_potty_cost: (data.porta_potty_required) ? 
        (data.porta_potty_cost): 0,
      waste_cost: (data.waste_required) ? 
        data.waste_cost : 0,
    };
  };

  hide_elements = () => {
    $('#navID').css('display', 'none')
    $('#userNav').css('display', 'none')
    // $('#noUserNav').css('display', 'none')
    $('#imageBar').css('display', 'none')
    $('#footerID').css('display', 'none')
        // $('#noUserNav').css('display', 'none')
  };

  roundCurrency(n) {
    let mult = 100, value;
    value = parseFloat((n * mult).toFixed(6))
    return Math.round(value) / mult;
  }

  render() {
    let docApp, documentPackage, siteAssessment, partners;
    if (this.props.type == "project") {
      const proj = this.props.projectData;
      docApp = proj.documentPackage.application;
      documentPackage = proj.documentPackage;
      siteAssessment = proj.siteAssessment;
      partners = proj.partners;
    } else if (this.props.type == "assessment") {
      const assessment = this.props.assessmentData;
      docApp = assessment.documentPackage.application;
      documentPackage = assessment.documentPackage;
      siteAssessment = assessment;
      partners = assessment.partners;
    } else {
      return;
    }
    let d = new Date();
    const date_string = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    let name = (docApp.name.middle && docApp.name.middle.length > 0) ?
            `${docApp.name.first} ${docApp.name.middle} ${docApp.name.last}` : 
            `${docApp.name.first} ${docApp.name.last}`;
    if (docApp.name.preferred && docApp.name.preferred.length > 0)
      name += ` (Preferred: ${docApp.name.preferred})`;

    let address = docApp.address.line_1;
    if (docApp.address.line_2 && docApp.address.line_2.length > 0) {
      address += `| ${docApp.address.line_2}\n`;
    }
    let total_cost = 0,
        total_volunteers = 0,
        cost;
    let vet_summary = (documentPackage && documentPackage.notes) ? 
          documentPackage.notes.vet_summary : null,
        assessment_summary = siteAssessment.summary;
    return (
    <div>
      <div id="cblock-container">
        <img src="/images/app_project/handleit_logo.png"></img>
      </div>
      <p id="info-container">
        Catalyst Partnerships is a non-proft general contractor. We bring together useful resources and caring volunteers to meet the
        needs of under-resourced people in our community. “Handle-It” volunteers can provide minor home repairs to improve the safety
        of the home for no fee. Handle-It Volunteers are skilled handy men and women who have undergone and passed background
        checks and are insured by Catalyst. To the extent required by law, Catalyst is duly licensed, bonded, and insured to perform such
      work
      </p>
      <h1 id="doc-header">CATALYST PARTNERSHIPS - PROJECT ASSESSMENT FORM {date_string}</h1>
      <table>
        <tbody>
          <tr>
            <td><b>Recipient Name: </b></td>
            <td>{name}</td>
          </tr>
          <tr>
            <td><b>Address:</b></td>
            <td>
              <div>{address}</div>
              <div>{docApp.address.city}, {docApp.address.state} {docApp.address.zip}</div>
            </td>
          </tr>
          <tr>
            <td><b>Vetting Summary</b></td>
            <td>{vet_summary}</td>
          </tr>
          <tr>
            <td><b>Assessment Summary</b></td>
            <td>{assessment_summary}</td>
          </tr>
        </tbody>
      </table>

      <h2><b>Work Items</b></h2>
      {this.state.workitems.map((workItem) => {
        total_volunteers += workItem.volunteers_required;
        return (
          <div className="workitem-total-container" key={workItem._id}>
            <div key={"wi-" + workItem._id} className="workitem-container">
              <table>
                <tbody>
                  <tr>
                    <th>Work Item Name</th>
                    <td>{workItem.name}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{workItem.description}</td>
                  </tr>
                  <tr>
                    <th>Site Comments</th>
                    <td>{workItem.assessment_comments}</td>
                  </tr>
                  <tr>
                    <th>Volunteers Needed</th>
                    <td>{workItem.volunteers_required}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4>Materials List</h4>
            {workItem.materialsItems.map( (materialsItem) => {
              cost = this.roundCurrency(materialsItem.price * materialsItem.quantity);
              total_cost += cost;
              return (
              <div key={"wi-mi-" + materialsItem._id} className="materialsItem-container">
                <table>
                  <tbody>
                    <tr>
                      <th>Description</th>
                      <td>{materialsItem.description}</td>
                    </tr>
                    <tr>
                      <th>Quantity</th>
                      <td>{materialsItem.quantity}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>{materialsItem.price}</td>
                    </tr>
                    <tr>
                      <th>Total</th>
                      <td>${cost.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>)
            })}

          </div>
        )
      })}

      <h2><b>Cost</b></h2>
      <div>Total Work Items Cost: ${total_cost.toFixed(2)}</div>
      <div>Porta Potty Cost: ${this.state.porta_potty_cost.toFixed(2)}</div>
      <div>Total Cost Estimate: ${this.state.waste_cost.toFixed(2)}</div>
      <div>Final Cost Estimate: ${(total_cost + this.state.porta_potty_cost + 
                              this.state.waste_cost).toFixed(2)}</div>
      <div>Total Volunteers Needed: {total_volunteers}</div>

      <h2><b>Hazard / Safety Testing</b></h2>
      <div>Lead: {siteAssessment.lead}</div>
      <div>Asbestos: {siteAssessment.asbestos}</div>
      <div>Safety Plan: {siteAssessment.safety_plan}</div>

      <h2><b>Partners</b></h2>

      <div id="partners-container">
        {partners.map(partner => {
          return (
          <div className="partner-container" key={partner._id}>
            <table>
              <tbody>
                <tr>
                  <th>Organization</th>
                  <td>{partner.org_name}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{partner.org_address}</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>{partner.contact_name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{partner.contact_email}</td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>{partner.contact_phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
          );
        })}
      </div>
    </div>);
  }
}


function loadReact() {
  if (type == "project") {
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      success: function(data) {
        console.log(data);
        ReactDOM.render(<PAFApp type={type} projectData={data}/>, document.getElementById("pdf_container"));
      }
    });
  } else if (type == "assessment") {
    $.ajax({
      url: "/app_project/site_assessments/" + assessment_id,
      type: "GET",
      success: function(data) {
        console.log(data);
        ReactDOM.render(<PAFApp type={type} assessmentData={data}/>, document.getElementById("pdf_container"));
      }
    });
  } 
}

loadReact();