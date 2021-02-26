export { PdfButtons }

class PdfButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick_PAF = () => {
    if (this.props.type == "project") {
      const project_id = this.props.project_id;
      window.open("/app_project/projects/paf_form/" + project_id);
    }
    
  }

  onClick_handleitForm = () => {
    if (this.props.type == "project") {
      const project_id = this.props.project_id;
      window.open("/app_project/projects/handleit_form/" + project_id);
    }
    
  }

  render() {
    return (
      <div>
        <button type="button"
          onClick={this.onClick_PAF}>PAF Report</button>
        <button type="button"
          onClick={this.onClick_handleitForm}>Handle-It Report</button>
      </div>
    )
  }
}