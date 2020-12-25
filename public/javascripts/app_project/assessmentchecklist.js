class AssessmentChecklist extends React.Component {
  constructor(props) {
    // site_assessment directly loaded into state later (w/ ajax call)
    super(props);
    this.state = {
      porta_potty_required: false,
      waste_required: false,
      porta_potty_cost: 0,
      waste_cost: 0,
    };
    this.safety_plan_timer = null;
    this.porta_potty_cost_timer = null;
    this.waste_cost_timer = null;
    this.summary_timer = null;
    this.costsItems_table = React.createRef();
  }
  // Convert the date given by server (UTC) to local date & time
  // Returns as a Date object
  convert_date(old_date) {
    var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      let [year, month, date, hours, minutes] = result.slice(1,6);
      return new Date(Date.UTC(year, parseInt(month)-1  , date, hours, minutes));
    }
    return null;
  }
  load_assessment = (assessment) => {
    if (assessment.project_start_date)
      assessment.project_start_date = this.convert_date(assessment.project_start_date);
    if (assessment.project_end_date)
      assessment.project_end_date = this.convert_date(assessment.project_end_date);
    this.setState(assessment, () => {
      // Set safety plan coloring after assessment is loaded
      this.color_safety_plan_textarea();
    });
    if (assessment.costsItems){
      this.costsItems_table.current.setItems(assessment.costsItems);
    }
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

  componentDidMount =() => {
    $('.checklist-dateinput').datepicker({
      format: 'yyyy-mm-dd',
    }).on("hide", (e) => this.onChange_date(e));
  }

  get_date(type) {
    var date_input_id, modifier;
    if (type == "start") {
      date_input_id = "checklist-start-date";
      modifier = "start";
    } else if (type == "end") {
      date_input_id = "checklist-end-date";
      modifier = "end";
    }
    var value = $("#" + date_input_id).val();
    var regex = /(\d{4})-(\d{2})-(\d{2})/g,
        result = regex.exec(value);
    if (result) { // Have to test since dates could be null
      var obj = {
        year: result[1],
        month: result[2],
        day: result[3],
        hours: parseInt($("#" + modifier + "-hour-select").val()),
        minutes: $("#" + modifier + "-minute-select").val(),
      };
      var period = $("#" + modifier + "-period-select").val();
      if (period == "pm") {
        obj.hours += 12;
      }
      return obj;
    }
    return null;
  }
  // Either change date or times
  onChange_date = (e) => {
    var timetype = e.target.getAttribute("timetype");
    
    if (timetype == "start" || timetype == "end") {
      var result = this.get_date(timetype);
      if (result) {
        result.assessment_id = this.state._id;
        result.property = "project_" + timetype + "_date"
        funkie.edit_site_assessment(result, (returnData) => {
          var s = {};
          s[result.property] = this.convert_date(returnData.date);
          this.setState(s);
        });
      }
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

  create_hour_options(type) {
    var hours = [];
    for(var i=0; i<12;i++) {
      hours.push([
        <option key={"hour-"+i} value={i}>{i >= 10 ? String(i) : "0" + String(i)}</option>
      ]);  
    }
    return hours
  }
  create_minute_options() {
    var minutes = [];
    for(var i=0; i<60;i++) {
      minutes.push([
        <option key={"min-"+i} value={i}>{i >= 10 ? String(i) : "0" + String(i)}</option>
      ]);
    }
    return minutes;
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

  set_create_costsitem_menu = () => {
    this.props.set_create_costsitem_menu(this.costsItems_table.current.add_item);
  }

  render() {
    var start_date = (this.state && this.state.project_start_date) ?
      this.state.project_start_date.toISOString().slice(0,10) :
      "",
      end_date = (this.state && this.state.project_end_date) ?
      this.state.project_end_date.toISOString().slice(0,10) :
      "";

    var start_hour = "",
        end_hour = "";
    if (this.state && this.state.project_start_date) {
      start_hour = this.state.project_start_date.getHours();
      if (start_hour >= 12) {
        start_hour -= 12;
      }
    }
    if (this.state && this.state.project_end_date) {
      end_hour = this.state.project_end_date.getHours();
      if (end_hour >= 12) {
        end_hour -= 12;
      }
    }
    var start_period = "",
        end_period ="";
    if (this.state && this.state.project_start_date) {
      start_period = (this.state.project_start_date.getHours() >= 12) ?
        "pm" : "am";
    }
    if (this.state && this.state.project_end_date) {
      end_period = (this.state.project_end_date.getHours() >= 12) ?
        "pm" : "am";
    }
    var start_minute = (this.state && this.state.project_start_date) ?
          this.state.project_start_date.getMinutes() : "",
        end_minute = (this.state && this.state.project_end_date) ?
          this.state.project_end_date.getMinutes() : "";


    var start_hours = this.create_hour_options("start"),
        end_hours = this.create_hour_options("end");
    var minutes = this.create_minute_options();
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
        </tbody>
      </table>
      <div className="form-group row">
        <div className="form-group row col-md-6 col-sm-12">
          <label className="col-sm-5 col-form-label">Start Date</label>
          <div className="col-sm-7">
            <input type="text" className="form-control checklist-dateinput" 
              name="project_start_date" placeholder="yyyy-mm-dd" timetype="start"
              id="checklist-start-date" value={start_date}
              onChange={this.onChange_date}></input>
          </div>
        </div>
        <div className="form-group row col-md-6 col-sm-12">
          <label className="col-sm-2 col-form-label" htmlFor="start-hour-select">
            Time</label>
          <div className="col-sm-10">
            <div className="form-inline">
              <select className="form-control" id="start-hour-select" 
                timetype="start" onChange={this.onChange_date} value={start_hour}>
                {start_hours}
              </select>
              <select className="form-control" id="start-minute-select" 
                timetype="start" onChange={this.onChange_date} value={start_minute}>
                {minutes}
              </select>
              <select className="form-control" id="start-period-select" 
                timetype="start" onChange={this.onChange_date} value={start_period}>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group row">
        <div className="form-group row col-md-6 col-sm-12">
          <label className="col-sm-5 col-form-label">End Date</label>
          <div className="col-sm-7">
            <input type="text" className="form-control checklist-dateinput" 
              name="project_end_date" placeholder="yyyy-mm-dd" timetype="end"
              id="checklist-end-date" value={end_date}
              onChange={this.onChange_date}></input>
          </div>
        </div>

        <div className="form-group row col-md-6 col-sm-12">
          <label className="col-sm-2 col-form-label" htmlFor="end-hour-select">
            Time</label>
          <div className="col-sm-10">
            <div className="form-inline">
              <select className="form-control" id="end-hour-select" 
                timetype="end" onChange={this.onChange_date} value={end_hour}>
                {end_hours}
              </select>
              <select className="form-control" id="end-minute-select"
                timetype="end" onChange={this.onChange_date} value={end_minute}>
                {minutes}
              </select>
              <select className="form-control" id="end-period-select"
                timetype="end" onChange={this.onChange_date} value={end_period}>
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
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
            id="safety-plan-textarea"
            value={this.state.safety_plan} property_type="safety_plan"
            onChange={this.onChange_inputs_timer}></textarea>
        </div>
      </div>

      <div className="form-group">
        <label>
          Other Costs
          <button type="button" className="btn btn-sm"
            onClick={this.set_create_costsitem_menu}>Create</button>
        </label>
        <CostsItemsTable 
          ref={this.costsItems_table} 
          set_edit_costsitem_menu = {this.props.set_edit_costsitem_menu}
        />
      </div>

      <div className="form-group">
        <label>Porta Potty</label>
        <div className="col form-check">
          <label htmlFor="porta-potty-required-checkbox">Required </label>
          <input type="checkbox" id="porta-potty-required-checkbox"
            checked={this.state.porta_potty_required}
            onChange={this.onChange_porta_checkbox}
          />
        </div>
        <div className="col">
          <label>Cost</label>
          <input type="number" className="form-control" min="0" step="0.01"
            property_type="porta_potty_cost"
            value={this.state.porta_potty_cost}
            onChange={this.onChange_inputs_timer}
            disabled={!this.state.porta_potty_required}
          ></input>
        </div>
      </div>

      <div className="form-group">
        <label>Waste/Dump Trailer</label>
        <div className="col form-check">
          <label>Required </label>
          <input type="checkbox" 
            checked={this.state.waste_required}
            onChange={this.onChange_waste_checkbox}
          />
        </div>

        <div className="col">
          <label>Cost</label>
          <input type="number" className="form-control" min="0" step="0.01"
            value={this.state.waste_cost}
            property_type="waste_cost"
            onChange={this.onChange_inputs_timer}
            disabled={!this.state.waste_required}
          ></input>
        </div>
      </div>
    </div>);
  }
}