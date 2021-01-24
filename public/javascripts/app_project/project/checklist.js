class Checklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checklist: {},
    };
    this.load_checklist();
    this.table_map = this.get_table_map();
  }

  load_checklist = () => {
    var url;
    if (this.props.type == "planning") {
      url = "../projects/" + this.props.project_id + "/plan_checklist";
    } else {
      url = "../projects/" + this.props.project_id + "/wrapup_checklist";
    }
    $.ajax({
      url: url,
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
    if (this.props.type == "planning") {
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
    } else {
      return {
        return_signup_sheet: "Return volunteer sign-up sheet to office",
        record_volunteer_info: "Record volunteer hours & info",
        schedule_porta_pickup: "Schedule porta potty pickup",
        schedule_waste_pickup: "Schedule waste bin pickup",
        arrange_waste_disposal: "Arrange waste disposal",
        return_materials_rental: "Return materials & rentals",
        turn_receipts_expenses: "Turn in receipts & expenses to office",
        process_reimbursement_checks: "Process reimbursement checks",
        submit_photos: "Submit photos to Flickr or office",
        submit_project_form: "Submit project report to office",
        update_project_webpage: "Update the project webpage",
        call_client: "Call client to see how project went",
        send_volunteer_email: "Send volunteer thank you emails",
        determine_followup: "Determine if followup is needed",
        sending_closing_letter: "Send closing recipient letter",
      }
    }
    
  }

  onChange_check_input = (e) => {
    var property = e.target.getAttribute("name"),
        value = e.target.checked;
    var url;
    if (this.props.type == "planning") {
      url = "/app_project/plan_checklist/" + this.state.checklist._id;
    } else {
      url = "/app_project/wrapup_checklist/" + this.state.checklist._id;
    }
    $.ajax({
      url: url,
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
    var url;
    if (this.props.type == "planning") {
      url = "/app_project/plan_checklist/" + this.state.checklist._id;
    } else {
      url = "/app_project/wrapup_checklist/" + this.state.checklist._id;
    }
    $.ajax({
      url: url,
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
    var checklist = this.state.checklist;
    if (key in checklist) {
      return (checklist[key]) ? checklist[key].complete : false;
    } else if (checklist.additional_checklist) {
      for (let i=0; i<checklist.additional_checklist.length; i++) {
        if (checklist.additional_checklist[i].name == key) {
          return checklist.additional_checklist[i].complete;
        }
      }
    }
    return false;
  }

  onClick_add_checklist = () => {
    var name = window.prompt("Name of item to add to checklist?");
    if (name == null) { // cancelled
      return;
    } else if (name && name.length > 4) {
      if (name in this.state.checklist) {
        window.alert("Checklist item name is already in use.");
        return;
      }
      console.log(this.table_map);
      let key;
      for (key in this.table_map) {
        if (this.table_map[key] == name) {
          window.alert("Checklist item name is already in use.");
          return;
        }
      }
      for (let i=0; i<this.state.checklist.additional_checklist.length; i++) {
        if (name == this.state.checklist.additional_checklist[i].name) {
          window.alert("Checklist item name is already in use.");
          return;
        }
      }
      $.ajax({
        url: "/app_project/checklist/" + this.state.checklist._id,
        type: "POST",
        data: {
          type: this.props.type,
          name: name,
        },
        context: this,
        success: function(itemData) {
          this.setState((state)=> {
            var new_checklist = {...state.checklist};
            new_checklist.additional_checklist.push(itemData);
            return {
              checklist: new_checklist,
            }
          })
        },
      })
    } else {
      window.alert("Please entere something with a lenght of at least 5.");
    }
  }

  onClick_delete_additional_item = (e) => {
    let name = e.target.getAttribute("name");
    var result = window.confirm(`Are you sure you want to delete ${name}?`);
    if (!result) {
      return;
    }
    $.ajax({
      url: "/app_project/checklist/" + this.state.checklist._id,
      type: "DELETE",
      data: {
        type: this.props.type,
        name: name,
      },
      context: this,
      success: function() {
        this.setState(state => {
          var new_checklist = {...state.checklist};
          let additional_checklist = new_checklist.additional_checklist;
          
          for (let i=0; i< additional_checklist.length; i++) {
            if (additional_checklist[i].name == name) {
              additional_checklist.splice(i, 1);
            }
          }
          return {checklist: new_checklist,};
        })
      },
    })
  }

  create_additional_items = () => {
    if (this.state.checklist.additional_checklist) {
      return this.state.checklist.additional_checklist.map((item) => {
          return this.create_item_row(item.name, item.name, true);
        });
    } else {
      return;
    }
  }

  create_item_row = (key_name, full_name, canDelete=false) => {
    var delBtn;
    if (canDelete) {
      delBtn = (<button
        onClick={this.onClick_delete_additional_item}
        name={key_name} className="btn btn-sm btn-danger"
        type="btn">Delete</button>);
    }
    return (
      <tr key={"row-" + key_name}>
        <td>{full_name} {delBtn}</td>
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
      <button type="button" className="btn btn-sm btn btn-outline-primary"
        onClick={this.onClick_add_checklist}>Add to Checklist</button>
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