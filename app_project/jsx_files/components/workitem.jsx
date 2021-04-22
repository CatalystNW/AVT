export { WorkItem }

class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.workitem;
    this.editable = (!this.props.workitem.transferred && !this.props.workitem.complete);
  }

  set_handleit_handler = (server_data) => {
    this.setState({
      handleit: server_data.handleit,
    });
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

  roundCurrency(n) {
    let mult = 100, value;
    value = parseFloat((n * mult).toFixed(6))
    return Math.round(value) / mult;
  }

  create_materialslist = () => {
    var total = 0, cost, price;
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
            price = this.roundCurrency(parseFloat(materialsItem.price))
            cost = this.roundCurrency(price * parseInt(materialsItem.quantity));
            total += cost;
            return (
              <tr key={materialsItem._id}>
                <td className="col-sm-4">
                  {materialsItem.description}</td>
                <td className="col-sm-3">{materialsItem.vendor}</td>
                <td className="col-sm-1">
                  {price.toFixed(2)}</td>
                <td className="col-sm-1">
                  {materialsItem.quantity}</td>
                <td className="col-sm-1">
                  {cost.toFixed(2)}
                </td>
                <td className="col-sm-2">
                  <button className="btn btn-secondary btn-sm"
                    onClick={this.onClick_edit_material_item}
                    item_id={materialsItem._id}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                          fill="currentColor" className="bi bi-pencil" 
                          viewBox="0 0 16 16" style={{"pointerEvents": "none",}}>
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                      </svg>
                  </button>
                  { // Prevent deleting on vetting worksheet page
                    this.props.page_type!="vetting" ? 
                    (<button className="btn btn-outline-danger btn-sm" 
                    description={materialsItem.description}
                    item_id={materialsItem._id} 
                    onClick={this.onClick_delete_materialsitem}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                          fill="currentColor" className="bi bi-trash" 
                          viewBox="0 0 16 16" style={{"pointerEvents": "none",}}>
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                  </button>)  : null
                  }
                </td>
              </tr>)
          })}
        </tbody>
        <tfoot>
          <tr>
            <th className="col-sm-4" >Total</th>
            <td className="col-sm-3"></td>
            <td className="col-sm-1"></td>
            <td className="col-sm-1"></td>
            <td className="col-sm-3" >{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    );
  }
  
  // Set timer when text is typed
  onChange_inputs_timer = (e) => {
    var property_type = e.target.getAttribute("property_type"),
        value = e.target.value;
    if (property_type == "volunteers_required") {
      value = parseInt(value)
      if (isNaN(value) || value < 0)
        value = 0;
    }
    clearTimeout(this[property_type + "_timer"]);

    this.setState({[property_type]: value});

    this[property_type + "_timer"] = setTimeout(() => {
      if (value == undefined || value.length == 0) {
        window.alert(`Please set ${property_type} to a value.`);
        e.target.focus();
        return;
      }
      
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
    if (this.state.type == "project") {
      statuses = [
        <option key={id+"review"} value="to_review">To Review</option>,
        <option key={id+"progress"}value="in_progress">In Progress</option>,
        <option key={id+"complete"} value="complete">Complete</option>,
      ];
    } else {
      statuses = [
        <option key={id+"to_review"} value="to_review">To Review</option>,
        <option key={id+"accepted"} value="accepted">Accepted</option>,
        <option key={id+"declined"} value="declined">Declined</option>,
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
          {this.editable && !this.state.handleit && this.props.page_type!="vetting" ?
            (<span>
              <button type="button" className="btn btn-sm btn-danger"
                onClick={this.onClick_del_workitem_btn}>Delete</button>
            </span>) : (null)
          }
          
        </h5>

        <p><b>Type:</b> {this.props.workitem.type} <b>Created:</b>{this.state.createdAt.replace(/T.+/, "")} </p>

        <b>Description</b>
        <p className="card-text">
          {this.state.description}
        </p>

        <b>Vetting Comments</b>
        <p className="card-text">
          {(this.state.vetting_comments && this.state.vetting_comments.length > 0) ?
            this.state.vetting_comments : "N/A"}
        </p>

        {this.state.handleit == false ?
          (<div>
            <b>Assessment Comments</b>
            <p className="card-text">
              {(this.state.assessment_comments && this.state.assessment_comments.length > 0) ?
                this.state.assessment_comments : "N/A"}
            </p>
          </div>) : null
        }
        

        {project_comments}

        <div className="card-text">
          <b>Handle-It </b> 
          <input type="checkbox" name="handleit"
            checked={this.state.handleit}
            workitem_id={this.state._id} readOnly />
        </div>
        <div className="form-group row">
          { // Hide Status if it's handle-it
          !this.state.handleit ?
            (<div className="col-md-6 col-sm-12">
            <label className="col-6 col-form-label"
              htmlFor="workitem-status-select"><b>Status</b></label>
            <div className="col-6">
              <select className="form-control" value={this.state.status}
                  id="workitem-status-select" 
                  disabled={this.props.page_type=="vetting"}
                  onChange={this.onChange_workitem_status}>
                {statuses}
              </select>
            </div>
          </div>) : null
          }
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
          <h4>Materials List</h4>
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