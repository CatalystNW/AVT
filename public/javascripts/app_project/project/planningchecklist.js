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
          var new_checklists = {...state.checklist};
          if (property in state.checklist) {
            new_checklists[property].complete = value;
          } else {
            for(let i=0; i<new_checklists.additional_checklist.length; i++) {
              if (new_checklists.additional_checklist[i].name == property) {
                new_checklists.additional_checklist[i].complete = value;
                break;
              }
            }
          }
          return {
            checklist: new_checklists
          };
        });
      },
    });
  }

  onChange_owner_select = (e) => {
    var property = e.target.getAttribute("name"),
        value = e.target.value;
    $.ajax({
      url: "/app_project/plan_checklist/" + this.state.checklist._id,
      type: "PATCH",
      data: {
        property: property,
        type: "owner",
        value: value,
      },
      context: this,
      success: function(data) {
        this.setState(state => {
          var new_checklists = {...state.checklist};
          if (property in state.checklist) {
            new_checklists[property].owner = value;
          } else {
            for(let i=0; i<new_checklists.additional_checklist.length; i++) {
              if (new_checklists.additional_checklist[i].name == property) {
                new_checklists.additional_checklist[i].owner = value;
                break;
              }
            }
          }
          return {
            checklist: new_checklists
          };
        });
      },
    });
  }

  get_owner = (key) => {
    var checklist = this.state.checklist;
    if (key in checklist) {
      return ((key in checklist) && "owner" in checklist[key]
                && checklist[key].owner != null) ? 
                checklist[key].owner : "";
    } else if ("additional_checklist" in checklist) {
      for (let i=0; i<checklist.additional_checklist.length; i++) {
        if (key == checklist.additional_checklist[i].name) {
          return (checklist.additional_checklist[i].owner != null) ? 
              checklist.additional_checklist[i].owner : "";
        }
      }
    }
    return "";
  }
  get_property = (key) => {
    if (key in this.state.checklist) {
      return (this.state.checklist[key]) ? this.state.checklist[key].complete : false;
    } else {
      return key;
    }
  }

  onClick_add_checklist = () => {
    var name = window.prompt("Name of item to add to checklist?");
    if (name == null) { // cancelled
      return;
    } else if (name && name.length > 4) {
      for (let i=0; i< this.state.checklist.additional_checklist.length; i++) {
        if (name == this.state.checklist.additional_checklist[i].name) {
          window.alert("Checklist item name is already in use.");
          return;
        }
      }
      $.ajax({
        url: "/app_project/plan_checklist/" + this.state.checklist._id,
        type: "POST",
        data: {
          name: name,
        },
        context: this,
        success: function(data) {

        },
      })
    } else {
      window.alert("Please entere something with a lenght of at least 5.");
    }
  }

  create_additional_items = () => {
    if (this.state.checklist.additional_checklist) {
      return this.state.checklist.additional_checklist.map((item) => {
          return this.create_item_row(item.name, item.name);
        });
    } else {
      return;
    }
  }

  create_item_row = (key_name, full_name) => {
    return (
      <tr key={"row-" + key_name}>
        <td>{full_name}</td>
        <td>
          <input type="checkbox" name={key_name}
            checked={this.get_property(key_name)}
            onChange={this.onChange_check_input}
          ></input>
        </td>
        <td>
          <select className="form-control"
              name={key_name}
              onChange={this.onChange_owner_select}
              value={this.get_owner(key_name)}
              >
            <option value="">Unassigned</option>
            {this.props.assignable_users.map((user)=> {
              return (<option key={key_name + "-option-" + user.id}
                value={user.id}>{user.name}</option>)
            })}
          </select>
        </td>
      </tr>);
  }

  render() {    
    return (<div>
      <button type="button" onClick={this.onClick_add_checklist}>Add to Checklist</button>
      <table className="table table-sm">
        <tbody>
          {Object.keys(this.table_map).map((key)=> {
            return this.create_item_row(key, this.table_map[key])
          })}
          {this.create_additional_items()}
        </tbody>
      </table>
    </div>);
  }
}