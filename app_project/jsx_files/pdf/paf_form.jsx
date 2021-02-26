class PAFApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectData: this.props.projectData,
    };
    // this.hide_elements();
  }

  hide_elements = () => {
    $('#navID').css('display', 'none')
    $('#userNav').css('display', 'none')
    // $('#noUserNav').css('display', 'none')
    $('#imageBar').css('display', 'none')
    $('#footerID').css('display', 'none')
        // $('#noUserNav').css('display', 'none')
  };

  render() {
    const proj = this.state.projectData;
    let d = new Date();
    const docApp = proj.documentPackage.application,
          documentPackage = proj.documentPackage,
          workitems = proj.workItems,
          siteAssessment = proj.siteAssessment,
          partners = proj.partners;
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
        total_volunteers = 0;

    let vet_summary = (documentPackage.notes ? 
      documentPackage.notes : null
      )
    return (
    <div>
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
        </tbody>
      </table>

      <h2><b>Work Items</b></h2>
      {workitems.map((workItem) => {
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
              total_cost += materialsItem.price * materialsItem.quantity;
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
                      <td>${materialsItem.price * materialsItem.quantity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>)
            })}

          </div>
        )
      })}

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

      <div>Total Cost Estimate: {total_cost}</div>
      <div>Total Volunteers Needed: {total_volunteers}</div>

    </div>);
  }
}


function loadReact() {
  $.ajax({
    url: "/app_project/projects/" + project_id,
    type: "GET",
    success: function(data) {
      console.log(data);
      ReactDOM.render(<PAFApp projectData={data}/>, document.getElementById("pdf_container"));
    }
  })
  
}

loadReact();