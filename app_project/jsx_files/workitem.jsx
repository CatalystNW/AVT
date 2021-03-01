export { WorkItem }

class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.workitem;
    this.editable = !this.props.workitem.transferred || !this.props.workitem.complete;
  }

  set_handleit_handler = (server_data) => {
    this.setState({
      handleit: server_data.handleit,
    });
  }

  onChange_handleit = (event) => {
    // Prevent changing handleit status
    // if (this.editable) {
    //   funkie.edit_workitem({
    //     workitem_id: event.target.getAttribute("workitem_id"),
    //     handleit: event.target.checked,
    //   }, null, this.set_handleit_handler);
    // }
  }

  add_item = (materialsItem_data) => {
    this.setState({
      materialsItems: [materialsItem_data, ...this.state.materialsItems],
    })
  }

  onClick_create_item =(e) => {
    this.props.set_create_materialsitem_menu(e, this.add_item);
  }

  remove_item = (materialsItem_id) => {
    var mlist = [],
        m = this.state.materialsItems;
    for (var i=0;i<m.length; i++) {
      if (m[i]._id != materialsItem_id)
        mlist.push(Object.assign({}, m[i]));
    }
    this.setState({materialsItems: mlist});
  }

  onClick_delete_materialsitem = (e) => {
    e.preventDefault();
    var description = e.target.getAttribute("description"),
        item_id = e.target.getAttribute("item_id");
    var result = window.confirm("Are you sure you want to delete " + description + "?");
    if (result) {
      funkie.delete_materialsitem(item_id, this.remove_item)
    }
  }
  // Finds the material item in state & then runs edit_materialsitem on it
  onClick_edit_material_item = (e) => {
    e.preventDefault();
    var materialsItem_id = e.target.getAttribute("item_id"),
        m = this.state.materialsItems;
    for (var i=0;i<m.length; i++) {
      if (m[i]._id == materialsItem_id) {
        this.props.set_edit_materialisitem_menu(m[i], this.edit_materialsitem_handler);
        break;
      }
    }
  }

  edit_menu_workitems_handler = (data) => {
    this.setState(data);
  }

  delete_workitem = () => {
    funkie.delete_workitem({workitem_id: this.state._id}, () => {
      this.props.remove_workitem(this.state._id);
    });
  };
  onClick_edit_workitem_btn = () => {
    this.props.set_edit_workitem_menu(this.state, this.edit_menu_workitems_handler);
  };
  onClick_del_workitem_btn = () => {
    var result = window.confirm(`Are you sure you want to delete ${this.name}?`);
    if (result) {
      this.delete_workitem();
    }
  };  

  edit_materialsitem_handler = (materialsItem) => {
    var new_itemlist = [],
        id = materialsItem._id,
        itemlist = this.state.materialsItems;
    for (var i=0; i< itemlist.length; i++) {
      if (itemlist[i]._id == id) {
        new_itemlist.push(materialsItem);
      } else {
        new_itemlist.push(Object.assign({}, itemlist[i]));
      }
    }
    this.setState({materialsItems: new_itemlist,});
  }

  create_materialslist = () => {
    var total = 0, cost;
    return (
      <table className="table">
          <thead>
            <tr>
              <th scope="col" className="col-sm-4">Description</th>
              <th scope="col" className="col-sm-3">Vendor</th>
              <th scope="col" className="col-sm-1">Price</th>
              <th scope="col" className="col-sm-1">Count</th>
              <th scope="col" className="col-sm-1">Total</th>
              <th scope="col" className="col-sm-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {this.state.materialsItems.map((materialsItem, index) => {
              cost = (parseFloat(materialsItem.price) * parseInt(materialsItem.quantity) * 100)/ 100;
              total += cost;
              return (
                <tr key={materialsItem._id}>
                  <td className="col-sm-4">
                    {materialsItem.description}</td>
                  <td className="col-sm-3">{materialsItem.vendor}</td>
                  <td className="col-sm-1">
                    {materialsItem.price}</td>
                  <td className="col-sm-1">
                    {materialsItem.quantity}</td>
                  <td className="col-sm-1">
                    {cost}
                    {/* Old way of putting options into total
                    { this.editable ?
                      (<div className="dropdown">
                      <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                        {cost}
                      </button>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" 
                          description={materialsItem.description}
                          item_id={materialsItem._id}
                          onClick={this.onClick_delete_materialsitem}>Delete</a>
                        <a className="dropdown-item"
                          item_id={materialsItem._id}
                          onClick={this.onClick_edit_material_item}>Edit</a>
                      </div>
                    </div>) : (<div>{cost}</div>)} */}
                  </td>
                  <td className="col-sm-2">
                    <button className="btn btn-secondary btn-sm"
                      onClick={this.onClick_edit_material_item}
                      item_id={materialsItem._id}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    <button className="btn btn-outline-danger btn-sm" 
                      description={materialsItem.description}
                      item_id={materialsItem._id} 
                      onClick={this.onClick_delete_materialsitem}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                  </td>
                </tr>)
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="col-sm-10" colSpan="4">Total</td>
              <td className="col-sm-2" >{total}</td>
            </tr>
          </tfoot>
        </table>
    );
  }
  
  // Set timer when text is typed
  onChange_inputs_timer = (e) => {
    var property_type = e.target.getAttribute("property_type"),
        value = e.target.value;

    clearTimeout(this[property_type + "_timer"]);

    this.setState({[property_type]: value});

    this[property_type + "_timer"] = setTimeout(() => {
      var data = {
        workitem_id: this.state._id,
        [property_type]: value
      };
      funkie.edit_workitem(data); // No callback
    }, 1000);
  }
  
  onChange_workitem_status = (e) => {
    if (!this.editable) {
      return;
    }
    var that = this,
        status = e.target.value;
    funkie.edit_workitem({
      workitem_id: this.state._id,
      status: status,
    }, () => {
      that.setState({status: status});
    });
  };
  
  render() {
    // Show project comments only on project page
    let project_comments = this.state.type == "project" ? 
      (<div><b>Project Comments</b>
        <p className="card-text">
          {(this.state.project_comments && this.state.project_comments.length > 0) ?
            this.state.project_comments : "N/A"}
        </p></div>): (null);
    let statuses;
    const id = this.state._id;
    if (this.props.page_type == "project") {
      statuses = [
        <option key={id+"review"} value="to_review">To Review</option>,
        <option key={id+"progress"}value="in_progress">In Progress</option>,
        <option key={id+"complete"} value="complete">Complete</option>,
      ];
    } else {
      statuses = [
        <option key={id+"to_review"} value="to_review">To Review</option>,
        <option key={id+"declined"} value="declined">Declined</option>,
        <option key={id+"accepted"} value="accepted">Accepted</option>,
      ];
    }
    return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{this.state.name}
          {this.editable ? 
            (<span style={{marginLeft: "15px"}}>
              <button type="button" className="btn btn-sm btn-secondary"
                onClick={this.onClick_edit_workitem_btn}>Edit</button></span>) : (null)
          }
          {this.editable && !this.state.handleit ? 
            (<span>
              <button type="button" className="btn btn-sm btn-danger"
                onClick={this.onClick_del_workitem_btn}>Delete</button>
            </span>) : (null)
          }
          
        </h5>

        <p>{this.state.createdAt.replace(/T.+/, "")}</p>

        <b>Description</b>
        <p className="card-text">
          {this.state.description}
        </p>

        <b>Vetting Comments</b>
        <p className="card-text">
          {(this.state.vetting_comments && this.state.vetting_comments.length > 0) ?
            this.state.vetting_comments : "N/A"}
        </p>

        <b>Assessment Comments</b>
        <p className="card-text">
          {(this.state.assessment_comments && this.state.assessment_comments.length > 0) ?
            this.state.assessment_comments : "N/A"}
        </p>

        {project_comments}

        <div className="card-text">
          <b>Handle-It </b> 
          <input type="checkbox" name="handleit"
            checked={this.state.handleit}
            workitem_id={this.state._id}
            onChange={this.onChange_handleit}>
          </input>
        </div>
        <div className="form-group row">
          <div className="col-md-6 col-sm-12">
            <label className="col-6 col-form-label"
              htmlFor="workitem-status-select"><b>Status</b></label>
            <div className="col-6">
              <select className="form-control" value={this.state.status}
                  id="workitem-status-select" disabled={this.state.handleit==true}
                  onChange={this.onChange_workitem_status}>
                {statuses}
              </select>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <label className="col-6 col-form-label"
              htmlFor="workitem-status-select"><b>Volunteers Required</b></label>
            <div className="col-6">
              { this.editable ?
              (<input type="number" className="form-control"
                name="volunteers_required"
                property_type="volunteers_required"
                onChange={this.onChange_inputs_timer}
                value={this.state.volunteers_required}></input>)
                : this.state.volunteers_required }
            </div>
          </div>
        </div>

        <div style={{display: "flex",}}>
          <div>
            <b>Materials List</b>
          </div>
          <div style={{marginLeft: "15px"}}>
            { this.editable ?
              (<button type="button" className="btn btn-primary btn-sm"
                onClick={this.onClick_create_item}
                workitem_id={this.state._id}>+ Item
              </button>) : null
            }
          </div>
        </div>
        
        {this.create_materialslist()}
      </div>
    </div>);
  }
}