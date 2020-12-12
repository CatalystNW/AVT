class CostsItemsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      costsItems: [],
    };
  }

  setItems = (costsItems) => {
    this.setState({costsItems: costsItems});
  }

  add_item =(costItem) => {
    var t = [...this.state.costsItems];
    t.push(costItem);
    this.setState({
      costsItems: t,
    });
  };

  del_item = (e) => {
    var costsitem_id = e.target.getAttribute("costsitem_id");
    var desc = "";
    for (var i=0; i<this.state.costsItems.length; i++) {
      if (this.state.costsItems[i]._id == costsitem_id) {
        desc = this.state.costsItems[i].description;
        break;
      }
    }

    var reply = window.confirm("Are you sure you want to delete " + desc + "?");
    if (reply) {
      funkie.del_costsitem(
        {
          costsitem_id: costsitem_id,
        }, 
        () =>  {
          var new_costsitems = [...this.state.costsItems];
          for (var i=0; i<new_costsitems.length; i++) {
            if (new_costsitems[i]._id == costsitem_id) {
              new_costsitems.splice(i, 1);
              break;
            }
          }
          this.setState({costsItems: new_costsitems});
      });
    }
  };

  edit_item = (e) => {
    var costsitem_id = e.target.getAttribute("costsitem_id");
    var costItem = "";
    for (var i=0; i<this.state.costsItems.length; i++) {
      if (this.state.costsItems[i]._id == costsitem_id) {
        costItem = this.state.costsItems[i];
        break;
      }
    }

    var prevData = {
      costsitem_id: costsitem_id,
      description: costItem.description,
      price: costItem.price,
      vendor: costItem.vendor,
    };

    this.props.set_edit_costsitem_menu(prevData, (new_costsitem) => {
      var new_costsitems = [...this.state.costsItems];
      for (i=0; i<new_costsitems.length; i++) {
        if (new_costsitems[i]._id == costsitem_id) {
          new_costsitems[i] = new_costsitem;
        }
      }
      this.setState({costsItems: new_costsitems});
    });
  }

  render() {
    var total = 0;
    for (var i=0; i<this.state.costsItems.length; i++) {
      total += this.state.costsItems[i].price;
    }
    return (
      <table className="table">
      <thead>
        <tr>
          <th scope="col">Description</th>
          <th scope="col">Cost</th>
          <th scope="col">Vendor</th>
          <th scope="col">Options</th>
        </tr>
      </thead>
      <tbody>
        {this.state.costsItems.map((item) => {
          return (
          <tr key={item._id}>
            <td>{item.description}</td>
            <td>{item.price}</td>
            <td>{item.vendor}</td>
            <td>
              <button type="button" className="btn btn-sm btn-danger"
                costsitem_id={item._id} onClick={this.del_item}
                >Del</button>
              <button type="button" className="btn btn-sm btn-warning"
                costsitem_id={item._id} onClick={this.edit_item}
                >Edit</button>
            </td>
          </tr>);
        })}
      </tbody>
      <tfoot>
        <tr>
          <td>Total</td>
          <td>{total}</td>
        </tr>
      </tfoot>
    </table>
    );
  }
}