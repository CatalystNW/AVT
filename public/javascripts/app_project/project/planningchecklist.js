class PlanningChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checklist: {},
    };
    this.load_checklist();
    this.table_map = this.get_table_map();
  }

  load_checklist = () => {
    $.ajax({
      url: "../projects/" + this.props.project_id + "/plan_checklist",
      type: "GET",
      context: this,
      success: function(checklist_data) {
        console.log(checklist_data)
        this.setState({
          checklist: checklist_data,
        });
      },
    });
  };

  // Maps table rows with the backend data properties
  // Note: uses ES6+ with some order in objects
  get_table_map = () => {
    return {
      contract_mailed_to_client: "Contract mailed to Client",
      create_endis: "Create project webpage, calendar event, and volunteer schedule in Endis",
      email_req_volunteers_and_register: "Send out initial email requesting volunteers. Register into Website/DB",
      proj_activation_call_client: "Project activation call to client",
      planning_visit: "Planning visit completed",
      create_cost_lists: "Create list of materials, rentals & supplies needed. Send to Darrell",
      verify_site_resources: "Verify site resources needed",
      arranged_purchase_delivery: "Arrange for purchase & delivery of all materials, rentals, supplies, etc.",
      rent_pota_potty: "Rent porta-pottie",
      rent_waste_bin: "Rent waste bin",
      check_weather: "Check the weather forecast and make plans accordingly",
      verify_number_volunteers: "Verify number of volunteers signed up",
      send_final_volunteer_email: "Send final email to signed up volunteers 3-5 days before project",
      send_followup_volunteer_email: "Send follow-up emails to volunteers via Endis as needed",
    }
  }

  onChange_check_input = (e) => {
    var property = e.target.getAttribute("name"),
        value = e.target.checked;
    $.ajax({
      url: "/app_project/plan_checklist/" + this.state.checklist._id,
      type: "PATCH",
      data: {
        property: property,
        type: "property",
        value: value,
      },
      context: this,
      success: function(data) {
        this.setState(state => {
          var new_checklists = {...this.state.checklist};
          new_checklists[property].complete = value;
          return {
            checklist: new_checklists
          };
        });
      },
    });
  }

  get_property = (key) => {
    return (this.state.checklist[key]) ? this.state.checklist[key].complete : false;
  }

  render() {    
    return (<div>
      <table className="table table-sm">
        <tbody>
          {Object.keys(this.table_map).map((key)=> {
            return (
              <tr key={"row-" + key}>
                <td>{this.table_map[key]}</td>
                <td>
                  <input type="checkbox" name={key}
                    checked={this.get_property(key)}
                    onChange={this.onChange_check_input}
                  ></input>
                </td>
                <td>
                  <select className="form-control">
                    <option value="">Unassigned</option>
                    {this.props.assignable_users.map((user)=> {
                      return (<option key={key + "-option-" + user.id}
                        value={user.id}>{user.name}</option>)
                    })}
                  </select>
                </td>
              </tr>);
          })}
        </tbody>
      </table>
    </div>);
  }
}