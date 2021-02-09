class PAFApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectData: this.props.projectData,
    };
    this.hide_elements();
  }

  hide_elements = () => {
    $('body').css('paddingTop', '0px')
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
    const docApp = this.state.projectData.documentPackage.application;
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
    return (
    <div>
      <h1>CATALYST PARTNERSHIPS - PROJECT ASSESSMENT FORM {date_string}</h1>
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
            <td>{proj.documentPackage.notes.vet_summary}</td>
          </tr>
        </tbody>
      </table>

      <h2><b>Work Items</b></h2>
      {proj.workItems.map((workItem) => {
        return (
          <div key={"wi-" + workItem._id} className="workitem-container">
            <h3>Work Item Name: {workItem.name}</h3>
            <div>Description: {workItem.description}</div>
            <div>Site Comments: {workItem.assessment_comments}</div>

            <h4>Materials List</h4>
            {workItem.materialsItems.map( (materialsItem) => {
              return (
              <div key={"wi-mi-" + materialsItem._id} className="materialsItem-container">
                <div>Description: {materialsItem.description}</div>
                <div>Quantity: {materialsItem.quantity}</div>
                <div>Price: {materialsItem.price}</div>
                <div>Total: ${materialsItem.price * materialsItem.quantity}</div>
              </div>)
            })}
          </div>
        )
      })}

      <h2><b>Hazard / Safety Testing</b></h2>
      <div>Lead: </div>
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