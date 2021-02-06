export { PdfButtons }

class PdfButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick_PAF = () => {
    console.log(jspdf);
    const doc = new jspdf.jsPDF();
    doc.text("Hello world", 10, 10);
    doc.save("test.pdf");
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