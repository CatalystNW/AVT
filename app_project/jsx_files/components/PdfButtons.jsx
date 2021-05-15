export { PdfButtons }

class PdfButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick_PAF = () => {
    if (this.props.type == "project") {
      const project_id = this.props.project_id;
      window.open("/app_project/projects/paf_form/" + project_id);
    } else if (this.props.type == "assessment") {
      const assessment_id = this.props.assessment_id;
      window.open("/app_project/site_assessments/paf_form/" + assessment_id);
    }
  }

  onClick_handleitForm = () => {
    if (this.props.type == "project") {
      const project_id = this.props.project_id;
      window.open("/app_project/projects/handleit_form/" + project_id);
    } else if (this.props.type == "assessment") {
      const assessment_id = this.props.assessment_id;
      window.open("/app_project/site_assessments/handleit_form/" + assessment_id);
    }
  }

  render() {
    return (
      <div>
        {this.props.handleit == true ?
          (<button type="button"
          onClick={this.onClick_handleitForm}>Handle-It Report</button>) :
          (<button type="button"
          onClick={this.onClick_PAF}>PAF Report</button>)
        }
        
      </div>
    )
  }
}