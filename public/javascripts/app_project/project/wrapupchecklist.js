class WrapupChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.load_checklist();
    this.table_map = this.get_table_map();
  }

  load_checklist = () => {
    $.ajax({
      url: "../projects/" + this.props.project_id + "/wrapup_checklist",
      type: "GET",
      context: this,
      success: function(checklist_data) {
        console.log(checklist_data)
        this.setState({
          checklist: checklist_data,
        });
      },
    });
  }

  get_table_map = () => {
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

  onClick_delete_additional_item = () => {};
  onClick_add_checklist = () => {};


  render() {
    return (<div>
      <button type="button" className="btn btn-sm btn btn-outline-primary"
        onClick={this.onClick_add_checklist}>Add to Checklist</button>
      <table className="table table-sm">
        <tbody>
          {Object.keys(this.table_map).map((key)=> {
            return this.create_item_row(key, this.table_map[key])
          })}
          {/* {this.create_additional_items()} */}
        </tbody>
      </table>
    </div>);
  }
}