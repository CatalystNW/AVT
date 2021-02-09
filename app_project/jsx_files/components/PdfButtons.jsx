export { PdfButtons }

class PdfButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick_PAF = () => {
    const project_id = this.props.project_id;
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      success: function(data) {
        console.log(data);
        const docApp = data.documentPackage.application;

        let startY = 15,
            startX = 10,
            fontSize = 12;
        const doc = new jspdf.jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);

        const lineHeight = doc.getLineHeight(text) / doc.internal.scaleFactor;

        let d = new Date();
        const date_string = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
        var text = `CATALYST PARTNERSHIPS - PROJECT ASSESSMENT FORM - ${date_string}`;
        doc.text(text, startX, startY);
        doc.setFont("helvetica", "normal");
        console.log(doc.getLineHeight(text) / doc.internal.scaleFactor);
        startY += lineHeight * 2;

        let name = (docApp.name.middle && docApp.name.middle.length > 0) ?
            `${docApp.name.first} ${docApp.name.middle} ${docApp.name.last}` : 
            `${docApp.name.first} ${docApp.name.last}`;
        if (docApp.name.preferred && docApp.name.preferred.length > 0)
          name += ` (Preferred: ${docApp.name.preferred})`;

        let address = docApp.address.line_1;
        if (docApp.address.line_2 && docApp.address.line_2.length > 0) {
          address += `| ${docApp.address.line_2}\n`;
        }
        doc.text([
          `Name: ${name}`,
          `Address: ${address}`,
          `          ${docApp.address.city}, ${docApp.address.state} ${docApp.address.zip}`
        ], startX, startY);
        doc.save("test.pdf");
      }
    })
  }

  render() {
    return (
      <div>
        <button type="button"
          onClick={this.onClick_PAF}>PAF Report</button>
        <button type="button">Handle-It Report</button>
      </div>
    )
  }
}