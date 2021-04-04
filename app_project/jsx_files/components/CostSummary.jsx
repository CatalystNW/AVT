export { CostSummary }

class CostSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data_type: "site_assessment",
      num_accepted_project_workitems: 0,
      accepted_project_materials: [],
      accepted_project_volunteers: 0,

      num_review_project_workitems: 0,
      review_project_materials: [],
      review_project_volunteers: 0,
    };
  }

  /**
   * Loads either project or assessment data depending on
   * data_type and id parameters.
   * 
   * Does so using load_site_asssessment_data or load_project_data
   * @param {String} data_type "site_assessment" or "project"
   * @param {String} id ID of the project or assessment to be loaded
   */
  load_data = (data_type, id) => {
    if (data_type == "site_assessment") {
      this.load_site_assessment_data(id);
    } else if (data_type == "project") {
      this.load_project_data(id);
    }
  }
  loadWorkItems = (data_type, workItems) => {
    let accepted_project_materials = [],
        num_accepted_project_workitems = 0,
        accepted_project_volunteers = 0,

        num_review_project_workitems = 0,
        review_project_materials = [],
        review_project_volunteers = 0,
        i, j, item_arr;
    for (i=0; i< workItems.length; i++) {
      if (workItems[i].status == "declined") {
        continue;
      }
      if (data_type == "site_assessment" && workItems[i].status == "to_review") {
        item_arr = review_project_materials;
        num_review_project_workitems += 1
        if (workItems[i].volunteers_required) {
          review_project_volunteers += workItems[i].volunteers_required;
        }
      } else {
        // Project Work Items (whether handleit or not) will show everything here
        // and accepted assess. work items
        item_arr = accepted_project_materials;
        num_accepted_project_workitems += 1
        if (workItems[i].volunteers_required) {
          accepted_project_volunteers += workItems[i].volunteers_required;
        }
      }

      for (j=0;j<workItems[i].materialsItems.length; j++) {
        item_arr.push(workItems[i].materialsItems[j]);
      }
    }
    this.setState({
      num_accepted_project_workitems:    num_accepted_project_workitems,
      accepted_project_materials:        accepted_project_materials,
      accepted_project_volunteers:          accepted_project_volunteers,

      num_review_project_workitems: num_review_project_workitems,
      review_project_materials: review_project_materials,
      review_project_volunteers: review_project_volunteers,
      data_type: data_type,
    });
  };
  /**
   * Loads project data from the server and saves it into state:
   * data_type, num_accepted_project_workitems, accepted_project_materials, and accepted_project_volunteers
   * @param {String} project_id ID of project
   */
  load_project_data = (project_id) => {
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      context: this,
      success: function(projectData) {
        this.loadWorkItems("project", projectData.workItems);
      }
    })
  };
  /**
   * Loads site assessment data from the server and saves it into state:
   * data_type, num_accepted_project_workitems, accepted_project_materials, and accepted_project_volunteers
   * @param {String} assessment_id ID of site assessment
   */
  load_site_assessment_data = (assessment_id) => {
    $.ajax({
      type: "GET",
      url: "/app_project/site_assessments/" + assessment_id,
      context: this,
      success: function(siteAssessmentData) {
        console.log(siteAssessmentData);
        this.loadWorkItems("site_assessment", siteAssessmentData.workItems);
      }
    });
  }

  roundCurrency(n) {
    let mult = 100, value;
    value = parseFloat((n * mult).toFixed(6))
    return Math.round(value) / mult;
  }

  /**
   * Creates the materials item table for the Cost Summary
   * @param {String} workitem_type
   * @returns Table element
   */
  create_materialsitems_table = (workitem_type) => {
    let arr = (workitem_type == "accepted") ?
              this.state.accepted_project_materials :
              this.state.review_project_materials,
        total = 0, cost;
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
            cost = this.roundCurrency(item.quantity * item.price);
            total += cost;
            return (
              <tr key={workitem_type + "_" + index}>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.vendor}</td>
                <td>{cost.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    );
  };

  render() {
    return(
      <div>
        <div>
          {this.state.data_type == "site_assessment" ?
            (<h2>Project Work Items Accepted</h2>) :
            (<h2>Project Work Items</h2>)
          }
          <table className="table">
            <tbody>
              <tr>
                <th className="col-xs-6 col-lg-4"># Work Items</th>
                <td className="col-xs-6 col-lg-4">{this.state.num_accepted_project_workitems}</td>
              </tr>
              <tr>
                <th className="col-xs-6 col-lg-4">Volunteers Required</th>
                <td className="col-xs-6 col-lg-4">{this.state.accepted_project_volunteers}</td>
              </tr>
              <tr>
                <td>
                  <h3>Materials Lists</h3>
                  {this.create_materialsitems_table("accepted")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {this.state.data_type == "site_assessment" ?
          (<div>
            <h2>Project Work Items In Review</h2>
            <table className="table">
              <tbody>
                <tr>
                  <th className="col-xs-6 col-lg-4"># Work Items</th>
                  <td className="col-xs-6 col-lg-4">{this.state.num_review_project_workitems}</td>
                </tr>
                <tr>
                  <th className="col-xs-6 col-lg-4">Volunteers Required</th>
                  <td className="col-xs-6 col-lg-4">{this.state.review_project_volunteers}</td>
                </tr>
                <tr>
                  <td>
                    <h2>Materials Lists</h2>
                    {this.create_materialsitems_table("review")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>) : null
        }
      </div>
    );
  }
}