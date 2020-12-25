class CostSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num_handleit_workitems: 0,
      num_project_workitems: 0,
      handleit_materials: [],
      project_materials: [],
    };
  }

  load_data = () => {
    var that = this;
    funkie.get_assessment(app_id, function(data) {
      var handleit_materials = [],
          project_materials = [],
          num_handleit_workitems = 0,
          num_project_workitems = 0;
      console.log(data.site_assessment);
      var workItems = data.site_assessment.workItems,
          i, j, item_arr;
      for (i=0; i< workItems.length; i++) {
        if (workItems[i].handleit) {
          item_arr = handleit_materials;
          num_handleit_workitems += 1;
        } else {
          item_arr = project_materials;
          num_project_workitems += 1
        }
        for (j=0;j<workItems[i].materialsItems.length; j++) {
          item_arr.push(workItems[i].materialsItems[j]);
        }
      }
      that.setState({
        num_handleit_workitems: num_handleit_workitems,
        num_project_workitems: num_project_workitems,
        handleit_materials: handleit_materials,
        project_materials: project_materials,
      });
    });
  }

  get_items_tbody = (workitem_type) => {
    var arr = (workitem_type == "project") ? 
      this.state.project_materials : this.state.handleit_materials;
    return (
      <tbody>
        {arr.map((item, index) => {
          return (
            <tr key={workitem_type + "_" + index}>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.vendor}</td>
              <td>{item.quantity * item.price}</td>
            </tr>
          )
        })}
      </tbody>
    );
  }

  render() {
    var header = (<tr>
      <th scope="col">Description</th>
      <th scope="col">Price</th>
      <th scope="col">Count</th>
      <th scope="col">Vendor</th>
      <th scope="col">Total</th>
    </tr>);
    return(
      <table className="table">
        <tbody>
          <tr>
            <th className="col-xs-8"># Handle-It Work items</th>
            <td className="col-xs-4">{this.state.num_handleit_workitems}</td>
          </tr>
          <tr>
            <td>
              <h2>Materials Lists</h2>
              <table className="table">
                <thead>
                  {header}
                </thead>
                {this.get_items_tbody("handleit")}
              </table>
            </td>
          </tr>
          <tr>
            <th className="col-xs-8">Volunteers Req.</th>
            <td className="col-xs-4"></td>
          </tr>
          <tr>
            <th className="col-xs-8"># Project Work Items Accepted</th>
            <td className="col-xs-4">{this.state.num_project_workitems}</td>
          </tr>
          <tr>
            <td>
              <h2>Materials Lists</h2>
              <table className="table">
                <thead>
                  {header}
                </thead>
                {this.get_items_tbody("project")}
              </table>
            </td>
          </tr>
          <tr>
            <th className="col-xs-8">Volunteers Req.</th>
            <td className="col-xs-4"></td>
          </tr>
        </tbody>
      </table>
    );
  }
}