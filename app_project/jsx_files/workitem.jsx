export { WorkItem }

class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.workitem;
    this.editable = !this.props.workitem.transferred;
  }

  set_handleit_handler = (server_data) => {
    this.setState({
      handleit: server_data.handleit,
    });
  }

  onChange_handleit = (event) => {
    if (this.editable) {
      funkie.edit_workitem({
        workitem_id: event.target.getAttribute("workitem_id"),
        handleit: event.target.checked,
      }, null, this.set_handleit_handler);
    }
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
    this.setState({
      name: data.name,
      description: data.description,
      assessment_comments: data.assessment_comments,
    });
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
              <th scope="col" className="col-sm-5">Description</th>
              <th scope="col" className="col-sm-1">Price</th>
              <th scope="col" className="col-sm-1">Count</th>
              <th scope="col" className="col-sm-3">Vendor</th>
              <th scope="col" className="col-sm-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {this.state.materialsItems.map((materialsItem, index) => {
              {cost = (parseFloat(materialsItem.price) * parseInt(materialsItem.quantity) * 100)/ 100;
                total += cost;}
              return (
                <tr key={"row"+materialsItem._id}>
                  <td className="col-sm-5" key={"desc-"+materialsItem._id}>
                    {materialsItem.description}</td>
                  <td className="col-sm-1" key={"price-"+materialsItem._id}>
                    {materialsItem.price}</td>
                  <td className="col-sm-1" key={"options-"+materialsItem._id}>
                    {materialsItem.quantity}</td>
                  <td className="col-sm-3"key={"vendor-"+materialsItem._id}>{materialsItem.vendor}</td>
                  <td className="col-sm-2"key={"del-"+materialsItem._id}>
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
                        <a className="dropdown-item" item_id={materialsItem._id}
                          item_id={materialsItem._id}
                          onClick={this.onClick_edit_material_item}>Edit</a>
                      </div>
                    </div>) : (<div>{cost}</div>)
                    }
                    
                  </td>
                </tr>
              )
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
    let project_comments = this.state.type == "project" ? 
      (<div><b>Project Comments</b>
        <p className="card-text">
          {this.state.project_comments}
        </p></div>): (null)
    return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{this.state.name}
          {this.editable ? 
            (<span>
              <button type="button" className="btn btn-sm btn-secondary"
                onClick={this.onClick_edit_workitem_btn}>Edit</button>
              <button type="button" className="btn btn-sm btn-warning"
                onClick={this.onClick_del_workitem_btn}>Delete</button>
            </span>) : (null)
          }
          
        </h5>
        <b>Description</b>
        <p className="card-text">
          {this.state.description}
        </p>

        <b>Vetting Comments</b>
        <p className="card-text">
          {this.state.vetting_comments}
        </p>

        <b>Assessment Comments</b>
        <p className="card-text">
          {this.state.assessment_comments}
        </p>

        {project_comments}

        <p className="card-text">
          <b>Handle-It </b> 
          <input type="checkbox" name="handleit"
            checked={this.state.handleit}
            workitem_id={this.state._id}
            onChange={this.onChange_handleit}>
          </input>
        </p>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label"
            htmlFor="workitem-status-select">Status</label>
          <div className="col-sm-8">
            <select className="form-control" value={this.state.status}
              id="workitem-status-select" 
              onChange={this.onChange_workitem_status}
              >
              <option value="to_review">To Review</option>
              <option value="handleit">Handleit</option>
              <option value="declined">Declined</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-4 col-form-label"
            htmlFor="workitem-status-select">Volunteers Required</label>
          <div className="col-sm-8">
            { this.editable ?
            (<input type="number" className="form-control"
              name="volunteers_required"
              property_type="volunteers_required"
              onChange={this.onChange_inputs_timer}
              value={this.state.volunteers_required}></input>)
              : this.state.volunteers_required }
          </div>
        </div>

        <b>Materials List</b>
        { this.editable ?
          (<button type="button" className="btn btn-primary btn-sm"
            onClick={this.onClick_create_item}
            workitem_id={this.state._id}>+ Item
          </button>) : null
        }
        
        {this.create_materialslist()}
      </div>
    </div>);
  }
}