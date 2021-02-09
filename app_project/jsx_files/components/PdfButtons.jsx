export { PdfButtons }

class PdfButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick_PAF = () => {
    const project_id = this.props.project_id;
    window.open("/app_project/paf_form/" + project_id);
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