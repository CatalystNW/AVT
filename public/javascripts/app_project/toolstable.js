class ToolsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      toolsItems: [],
    };
  }

  setTools = (toolsItems) => {
    this.setState({toolsItems: toolsItems});
  }

  addTool =(toolItem) => {
    var t = [...this.state.toolsItems];
    t.push(toolItem);
    this.setState({
      toolsItems: t,
    });
  };

  delTool = (e) => {
    var toolitem_id = e.target.getAttribute("toolitem_id");
    var desc = "";
    for (var i=0; i<this.state.toolsItems.length; i++) {
      if (this.state.toolsItems[i]._id == toolitem_id) {
        desc = this.state.toolsItems[i].description;
        break;
      }
    }

    var reply = window.confirm("Are you sure you want to delete " + desc + "?");
    if (reply) {
      funkie.del_tool(
        {
          toolitem_id: toolitem_id,
        }, 
        () =>  {
          var new_tools = [...this.state.toolsItems];
          for (var i=0; i<new_tools.length; i++) {
            if (new_tools[i]._id == toolitem_id) {
              new_tools.splice(i, 1);
              break;
            }
          }
          this.setState({toolsItems: new_tools});
      });
    }
  };

  editTool = (e) => {
    var toolitem_id = e.target.getAttribute("toolitem_id");
    var tool = "";
    for (var i=0; i<this.state.toolsItems.length; i++) {
      if (this.state.toolsItems[i]._id == toolitem_id) {
        tool = this.state.toolsItems[i];
        break;
      }
    }

    var prevData = {
      toolitem_id: toolitem_id,
      description: tool.description,
      price: tool.price,
      vendor: tool.vendor,
    };

    this.props.set_edit_toolsitem_menu(prevData, (new_toolsItem) => {
      var new_tools = [...this.state.toolsItems];
      for (i=0; i<new_tools.length; i++) {
        if (new_tools[i]._id == toolitem_id) {
          new_tools[i] = new_toolsItem;
        }
      }
      this.setState({toolsItems: new_tools});
    });
  }

  render() {
    var total = 0;
    for (var i=0; i<this.state.toolsItems.length; i++) {
      total += this.state.toolsItems[i].price;
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
        {this.state.toolsItems.map((item) => {
          return (
          <tr key={item._id}>
            <td>{item.description}</td>
            <td>{item.price}</td>
            <td>{item.vendor}</td>
            <td>
              <button type="button" className="btn btn-sm btn-danger"
                toolitem_id={item._id} onClick={this.delTool}
                >Del</button>
              <button type="button" className="btn btn-sm btn-warning"
                toolitem_id={item._id} onClick={this.editTool}
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