class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.workitem;
  }

  set_handleit_handler = (server_data) => {
    this.setState({
      handleit: server_data.handleit,
    });
  }

  onChange_handleit = (event) => {
    // funkie.set_handleit(event.target.getAttribute("workitem_id"), this.set_handleit_handler);
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

  onClick_delete_item = (e) => {
    e.preventDefault();
    var description = e.target.getAttribute("description"),
        item_id = e.target.getAttribute("item_id");
    var result = window.confirm("Are you sure you want to delete " + description + "?");
    if (result) {
      funkie.delete_item(item_id, this.remove_item)
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

  onClick_edit_workitem_btn = () => {
    this.props.set_edit_workitem_menu(this.state, this.edit_menu_workitems_handler);
  }

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
              <th scope="col" className="col-sm-1">#</th>
              <th scope="col" className="col-sm-5">Description</th>
              <th scope="col" className="col-sm-1">Price</th>
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
                  <td className="col-sm-1" key={"options-"+materialsItem._id}>
                    {materialsItem.quantity}
                  </td>
                  <td className="col-sm-5" key={"desc-"+materialsItem._id}>
                    {materialsItem.description}</td>
                  <td className="col-sm-1" key={"price-"+materialsItem._id}>
                    {materialsItem.price}</td>
                  <td className="col-sm-3"key={"vendor-"+materialsItem._id}>{materialsItem.vendor}</td>
                  <td className="col-sm-2"key={"del-"+materialsItem._id}>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                        {cost}
                      </button>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" 
                          description={materialsItem.description}
                          item_id={materialsItem._id}
                          onClick={this.onClick_delete_item}>Delete</a>
                        <a className="dropdown-item" item_id={materialsItem._id}
                          item_id={materialsItem._id}
                          onClick={this.onClick_edit_material_item}>Edit</a>
                      </div>
                    </div>
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
  
  render() {
    return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{this.state.name}
          <button type="button" className="btn btn-sm btn-secondary"
            onClick={this.onClick_edit_workitem_btn}>Edit</button>
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

        <p className="card-text">
          <b>Handle-It </b> 
          <input type="checkbox" name="handleit"
            checked={this.state.handleit}
            workitem_id={this.state._id}
            onChange={this.onChange_handleit}></input>
          
        </p>

        <b>Materials List</b>
        <button type="button" className="btn btn-primary btn-sm"
          onClick={this.onClick_create_item}
          workitem_id={this.state._id}>+ Item
        </button>
        {this.create_materialslist()}
      </div>
    </div>);
  }
}