import { DateMenuRow } from "../DateMenuRow.js"
import { PdfButtons } from "../components/PdfButtons.js"

export { AssessmentChecklist }

class AssessmentChecklist extends React.Component {
  constructor(props) {
    // site_assessment directly loaded into state later (w/ ajax call)
    super(props);
    this.state = {
      porta_potty_required: false,
      waste_required: false,
      porta_potty_cost: 0,
      waste_cost: 0,
      loaded_assessment: false,
    };
    this.safety_plan_timer = null;
    this.porta_potty_cost_timer = null;
    this.waste_cost_timer = null;
    this.summary_timer = null;
  }
  load_assessment = (assessment) => {
    assessment.loaded_assessment = true;
    this.setState(assessment, () => {
      // Set safety plan coloring after assessment is loaded
      this.color_safety_plan_textarea();
    });
  }
  // Change the textarea background color if there is no safety plan
  color_safety_plan_textarea = () => {
    var textarea = document.getElementById("safety-plan-textarea");
    if (textarea.value.length < 6) {
      textarea.classList.add("warning-box");
    } else {
      textarea.classList.remove("warning-box");
    }
  }
  
  onChange_select = (e) => {
    var assessment_id = this.state._id,
        value = $(e.target).val(),
        property_type = e.target.getAttribute("property_type");
    if (property_type == "lead" || property_type == "asbestos") {
      var data = {
        property: property_type,
        value: value,
        assessment_id: assessment_id,
      };
      funkie.edit_site_assessment(data, (returnData) => {
        this.setState({[property_type]: value});
      });
    }
  };
  // Set timer when text is typed
  onChange_inputs_timer = (e) => {
    var property_type = e.target.getAttribute("property_type"),
        value = e.target.value;

    clearTimeout(this[property_type + "_timer"]);

    this.color_safety_plan_textarea();

    this.setState({[property_type]: value});

    this[property_type + "_timer"] = setTimeout(() => {
      var data = {
        assessment_id: this.state._id,
        property: property_type,
        value: value,
      }
      funkie.edit_site_assessment(data); // No callback
    }, 1000);
  }

  onChange_porta_checkbox = (e) => {
    funkie.edit_site_assessment({
      assessment_id: this.state._id,
      property: "porta_potty_required",
      value: e.target.checked,
    });
    this.setState({
      porta_potty_required: e.target.checked,
    });
  }
  onChange_waste_checkbox = (e) => {
    funkie.edit_site_assessment({
      assessment_id: this.state._id,
      property: "waste_required",
      value: e.target.checked,
    });
    this.setState({
      waste_required: e.target.checked,
    });
  }

  onChange_status = (e) => {
    const newStatus = e.target.value;
    if ((newStatus == "approval_process" || newStatus == "approved") &&
      this.state.status == "pending") {
        window.alert("The Assessment must first be completed. Set the status to complete for the assessment.");
        return;
      }
    let result = true;
    if (newStatus == "declined") {
      result = window.confirm(
        `Are you sure you want to decline the site assessment? 
        This can't be undone.`)
    }
    
    if (result) {
      $.ajax({
        type: "PATCH",
        url: "/app_project/site_assessments/" + this.state._id,
        context: this,
        data: {
          assessment_id: this.state._id,
          property: "status",
          value: newStatus,
        },
        success: function(returnData, textStatus, xhr) {
          console.log(returnData);
          this.setState({
            status: newStatus,
          });
        },
        error: function(xhr, textStatus, err) {
          window.alert("Error. Please check that all the work items have either accepted or declined.");
        }
      });
    }
  };

  edit_drive_url = () => {
    var url = window.prompt("URL?", this.state.drive_url),
        that = this;
    console.log(url);
    if (url === null)
      return;
    if (url && url.includes("drive.google.com")) {
      funkie.edit_site_assessment({
        assessment_id: this.state._id,
        property: "drive_url",
        value: url,
      }, function() {
        that.setState({
          drive_url: url,
        });
      });
    } else {
      window.alert("Wrong URL format was provided");
    }
  };

  change_date_callback = (data) => {
    data.assessment_id = this.state._id;
    data.property = data.date_type;

    funkie.edit_site_assessment(data);
  };

  render() {
    return (
    <div>
      <table className="table">
        <tbody>
          <tr>
            <th className="col-xs-3">Vetting Summary</th>
            <td className="col-xs-9">
              {this.props.vetting_summary}
            </td>
          </tr>
          <tr>
            <th className="col-xs-3">Assessment Summary</th>
            <td className="col-xs-9">
              <textarea className="form-control" value={this.state.summary}
              property_type="summary"
              onChange={this.onChange_inputs_timer}
            ></textarea>
            </td>
          </tr>
          <tr>
            <th className="col-xs-3">PDFs</th>
            <td className="col-xs-9">
              <PdfButtons type="assessment" handleit={false}
                assessment_id={this.state._id}/>
            </td>
          </tr>
          <tr>
            <th className="col-xs-3">Drive URL</th>
            <td className="col-xs-9">
              <a href={this.state.drive_url} target="_blank">Google Drive URL</a>
              <button className="btn btn-sm" onClick={this.edit_drive_url}>Edit</button>
            </td>
          </tr>
          <tr>
          <th className="col-xs-3">
            <label htmlFor="assessment-status-select">Status</label></th>
            <td className="col-xs-9">
              <select name="assessment_status" className="form-control"
                onChange={this.onChange_status}
                value={this.state.status}
                id="assessment-status-select">
                <option value="pending">Pending</option>
                <option value="complete">Complete</option>
                <option value="approval_process">Project Approval</option>
                <option value="approved">Project Approved</option>
                <option value="declined">Declined</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      { this.state.loaded_assessment ?
        <DateMenuRow title="Assessment Date"
          date_type={"assessment_date"}
          date={this.state.assessment_date}
          change_callback={this.change_date_callback}
        />  :
        <div></div>
      }

      { this.state.loaded_assessment ?
        <DateMenuRow title="Project Start Date"
          date_type={"project_start_date"}
          date={this.state.project_start_date}
          change_callback={this.change_date_callback}
        />  :
        <div></div>
      }
      
      { this.state.loaded_assessment ?
        <DateMenuRow title="Project End Date"
          date_type={"project_end_date"}
          date={this.state.project_end_date}
          change_callback={this.change_date_callback}
        />  :
        <div></div>
      }
      
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Lead</label>
        <div className="col-sm-10">
          <select className="form-control" onChange={this.onChange_select}
            value={this.state.lead} property_type="lead">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Asbestos</label>
        <div className="col-sm-10">
          <select className="form-control" onChange={this.onChange_select}
            value={this.state.asbestos} property_type="asbestos">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Safety Plan</label>
        <div className="col-sm-10">
          <textarea className="form-control" rows='4'
            id="safety-plan-textarea" placeholder="Safety Plan must be filled in"
            value={this.state.safety_plan} property_type="safety_plan"
            onChange={this.onChange_inputs_timer}></textarea>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-sm-6 col-md-4">
          <label className="checkbox-label">Porta Potty </label>
          <input type="checkbox" id="porta-potty-required-checkbox"
            checked={this.state.porta_potty_required}
            onChange={this.onChange_porta_checkbox}
          />
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="input-group input-group-sm">
            <span className="input-group-addon">Cost</span>
            <input type="number" className="form-control" min="0" step="0.01"
              property_type="porta_potty_cost"
              value={this.state.porta_potty_cost}
              onChange={this.onChange_inputs_timer}
              disabled={!this.state.porta_potty_required}
            ></input>
          </div>
        </div>
      </div>

      <div className="form-group row">
        <div className="col-sm-6 col-md-4">
          <label className="checkbox-label">Waste/Dump Trailer </label>
          <input type="checkbox" 
            checked={this.state.waste_required}
            onChange={this.onChange_waste_checkbox}
          />
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="input-group input-group-sm">
            <span className="input-group-addon">Cost</span>
            <input type="number" className="form-control" min="0" step="0.01"
              value={this.state.waste_cost}
              property_type="waste_cost"
              onChange={this.onChange_inputs_timer}
              disabled={!this.state.waste_required}
            ></input>
          </div>
        </div>
      </div>
    </div>);
  }
}