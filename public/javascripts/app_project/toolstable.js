class ToolsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      toolsItems: [],
    };
  }

  setTools = (toolsItems) => {
    console.log(toolsItems);
    this.setState({toolsItems: toolsItems});
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
            <td></td>
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