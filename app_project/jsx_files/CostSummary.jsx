export { CostSummary }

class CostSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num_handleit_workitems: 0,
      num_project_workitems: 0,
      handleit_materials: [],
      project_materials: [],
      handleit_volunteers: 0,
      proj_volunteers: 0,
      data_type: "site_assessment",
    };
  }

  load_data = (data_type, id) => {
    if (data_type == "site_assessment") {
      this.load_site_assessment_data(id);
    } else if (data_type == "project") {
      this.load_project_data(id);
    }
  }

  load_project_data = (project_id) => {
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      context: this,
      success: function(projectData) {
        var workItems = projectData.workItems;
        var project_materials = [],
            num_project_workitems = workItems.length,
            project_volunteers = 0;

        let i, j;

        for (i=0; i<workItems.length; i++) {
          if (workItems[i].volunteers_required) {
            project_volunteers += workItems[i].volunteers_required;
          }
          for (j=0;j<workItems[i].materialsItems.length; j++) {
            project_materials.push(workItems[i].materialsItems[j]);
          }
        }
        this.setState({
          data_type: "project",
          num_project_workitems:    num_project_workitems,
          project_materials:        project_materials,
          proj_volunteers:          project_volunteers
        });
      }
    })
  }

  load_site_assessment_data = (assessment_id) => {
    var that = this;
    funkie.get_assessment(assessment_id, function(siteAssessmentData) {
      var handleit_materials = [],
          project_materials = [],
          num_handleit_workitems = 0,
          num_project_workitems = 0,
          handleit_volunteers = 0,
          proj_volunteers = 0;
      console.log(siteAssessmentData);
      var workItems = siteAssessmentData.workItems,
          i, j, item_arr;
      for (i=0; i< workItems.length; i++) {
        if (workItems[i].handleit) {
          item_arr = handleit_materials;
          num_handleit_workitems += 1;
          if (workItems[i].volunteers_required) {
            handleit_volunteers += workItems[i].volunteers_required;
          }
        } else {
          item_arr = project_materials;
          num_project_workitems += 1
          if (workItems[i].volunteers_required) {
            proj_volunteers += workItems[i].volunteers_required;
          }
        }
        for (j=0;j<workItems[i].materialsItems.length; j++) {
          item_arr.push(workItems[i].materialsItems[j]);
        }
      }
      that.setState({
        num_handleit_workitems:   num_handleit_workitems,
        num_project_workitems:    num_project_workitems,
        handleit_materials:       handleit_materials,
        project_materials:        project_materials,
        proj_volunteers:          proj_volunteers,
        handleit_volunteers:      handleit_volunteers,
        data_type:                "site_assessment",
      });
    });
  }

  create_materialsitems_table = (workitem_type) => {
    var arr = (workitem_type == "project") ? 
      this.state.project_materials : this.state.handleit_materials;
    var total = 0;
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Count</th>
            <th scope="col">Vendor</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {arr.map((item, index) => {
            total += item.quantity * item.price;
            return (
              <tr key={workitem_type + "_" + index}>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.vendor}</td>
                <td>{item.quantity * item.price}</td>
              </tr>
            );
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

  render() {
    let isSiteAssessment = this.state.data_type=="site_assessment";
    return(
      <div>
        {isSiteAssessment ? 
        <table className="table">
          <tbody>
            <tr>
              <th className="col-xs-8"># Handle-It Work items</th>
              <td className="col-xs-4">{this.state.num_handleit_workitems}</td>
            </tr>
            <tr>
              <td>
                <h2>Materials Lists</h2>
                {this.create_materialsitems_table("handleit")}
              </td>
            </tr>
            <tr>
              <th className="col-xs-8">Volunteers Req.</th>
              <td className="col-xs-4">{this.state.handleit_volunteers}</td>
            </tr>
          </tbody>
        </table>
        : <div></div>
        }
        <table className="table">
          <tbody>
            <tr>
              <th className="col-xs-8"># Project Work Items Accepted</th>
              <td className="col-xs-4">{this.state.num_project_workitems}</td>
            </tr>
            <tr>
              <td>
                <h2>Materials Lists</h2>
                {this.create_materialsitems_table("project")}
              </td>
            </tr>
            <tr>
              <th className="col-xs-8">Volunteers Req.</th>
              <td className="col-xs-4">{this.state.proj_volunteers}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}