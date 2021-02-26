

class HandleitForm extends React.Component {
  constructor(props) {
    super(props);
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

  onClick_jspdf = () => {
    let doc = new jspdf.jsPDF({
      format: "letter",
    });
    var source = window.document.getElementsByTagName("body")[0];
    doc.html(
      source, 
      {
        callback: function(doc) {
          doc.output("dataurlnewwindow")
        },
        x: 15, y: 15},
    );
  };

  onClick_print = () => {
    window.print();
  }

  render() {
    let workitems, docApp;
    if (this.props.type=="project") {
      const proj = this.props.projectData;
      workitems = proj.workItems;
      docApp = proj.documentPackage.application;  
    } else if (this.props.type == "assessment") {
      const assessment = this.props.assessmentData;
      workitems = assessment.workItems;
      docApp = assessment.documentPackage.application;  
    }
    
    let d = new Date();
    const date_string = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    let name = (docApp.name.middle && docApp.name.middle.length > 0) ?
            `${docApp.name.first} ${docApp.name.middle} ${docApp.name.last}` : 
            `${docApp.name.first} ${docApp.name.last}`;

    let address = docApp.address.line_1;
    if (docApp.address.line_2 && docApp.address.line_2.length > 0) {
      address += `| ${docApp.address.line_2}\n`;
    }
    let total_cost = 0,
        total_volunteers = 0;

    return (
    <div>
      <div id="buttons-container" className="no-print">
        <button onClick={this.onClick_print}>Print</button>  
      </div>

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
      
      <h1 id="doc-header">HANDLE-IT WORK AGREEMENT</h1>
      <table>
        <tbody>
          <tr>
            <td><b>Property Owner:</b></td>
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
            <td><b>Phone:</b></td>
            <td>{docApp.phone.preferred}</td>
          </tr>
          <tr>
            <td><b>Email:</b></td>
            <td>{docApp.email}</td>
          </tr>
        </tbody>
      </table>

      <h2>Work Requested</h2>
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
                    <th>Cost</th>
                    <td>{workItem.materials_cost}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      <p id="price-p">
      Price: Catalyst Partnerships shall provide resources for the work. The cost of this project to the property owner is $0.  
      </p>

      <p>
        Scope: The scope of Handle-It Projects are jobs that will require 1-3 volunteers one day’s time and cost Catalyst
        $500 or less. In some cases, the property owner may already own the item that needs installation. If, after the
        Handle-It volunteer examines the scope of work, it is decided that the job would require more extensive labor and/or
        materials, this project may be recommended for consideration as a full Catalyst Project. This will require further
        fnancial vetting and estimation of the necessary work to restore the home to safety
      </p>

      <p>
        Volunteer Labor: Catalyst Partnerships is responsible for providing volunteer labor required to complete this project.
        Catalyst Partnerships is also responsible for providing materials, tools, and all other resources required to complete
        this project. Due to the nature of this non-proft, volunteer activity, property owner understands that the quality of
        service and/or craftsmanship received may not refect professional standards.
      </p>

      <p id="acceptance-p">
        Acceptance of Contract: The above price, specifcations and conditions are satisfactory and are hereby accepted.
        Catalyst Partnerships is authorized to furnish all materials and volunteer labor required to complete the project as
        stated.
      </p>

      <div className="signatures-container">
        <div>Date __________________</div>
        <div>
          <div>
            X_______________________________________________
          </div>
          <div>Property Owner</div>
        </div>
      </div>

      <div className="signatures-container">
        <div className="">Date __________________</div>
        <div className="">
          <div>
          X_______________________________________________
          </div>
          <div>Catalyst Handle-It Volunteer</div>
        </div>
      </div>

      <p>Please sign two copies – one for the homeowner, the other for the Catalyst offce</p>

    </div>);
  }
}


function loadReact() {
  console.log(type, assessment_id);
  if (type == "project") {
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      success: function(data) {
        console.log(data);
        ReactDOM.render(
          <HandleitForm type={type} projectData={data}/>, document.getElementById("pdf_container"));
      }
    })
  } else if (type == "assessment") {
    $.ajax({
      url: "/app_project/site_assessments/" + assessment_id,
      type: "GET",
      success: function(data) {
        console.log(data);
        ReactDOM.render(<HandleitForm type={type} assessmentData={data}/>, document.getElementById("pdf_container"));
      }
    });
  }
}

loadReact();