export { CostSummary }

import { functionHelper } from "../functionHelper.js"

class CostSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data_type: "site_assessment",
      num_accepted_project_workitems: 0,
      accepted_project_materials: [],
      accepted_project_volunteers: 0,

      portaPottyCost: 0,
      wasteCost: 0,

      num_review_project_workitems: 0,
      review_project_materials: [],
      review_project_volunteers: 0,
    };

    this.projectItemsTableId = "proj-mi-table";
    this.reviewProjectItemsTableId = "review-proj-mi-table";
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
  };
  loadDataToState = (data_type, projectOrAssessment) => {
    let workItems = projectOrAssessment.workItems;
    let accepted_project_materials = [],
        num_accepted_project_workitems = 0,
        accepted_project_volunteers = 0,

        num_review_project_workitems = 0,
        review_project_materials = [],
        review_project_volunteers = 0,
        i, j, item_arr;
    
    let wasteCost = 0, portaPottyCost = 0;
    if (projectOrAssessment.porta_potty_required) {
      portaPottyCost =  projectOrAssessment.porta_potty_cost;
    }
    if (projectOrAssessment.waste_required) {
      wasteCost =  projectOrAssessment.waste_cost;
    }

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

      wasteCost: wasteCost,
      portaPottyCost: portaPottyCost,
      name: projectOrAssessment.documentPackage.application.name.first + " " +
          projectOrAssessment.documentPackage.application.name.last
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
        console.log(projectData);
        this.loadDataToState("project", projectData);
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
        this.loadDataToState("site_assessment", siteAssessmentData);
      }
    });
  };

  roundCurrency(n) {
    let mult = 100, value;
    value = parseFloat((n * mult).toFixed(6))
    return Math.round(value) / mult;
  }

  /**
   * Creates the materials item table for the Cost Summary
   * @param {String} acceptedStatus True to create the accepted
   *  work items. Else, the work items in review.
   * @returns Table element
   */
  create_materialsitems_table = (acceptedStatus) => {
    let arr = (acceptedStatus === true) ?
              this.state.accepted_project_materials :
              this.state.review_project_materials,
        total = 0, cost, price,
        id = (acceptedStatus === true) ?
              this.projectItemsTableId :
              this.reviewProjectItemsTableId;
    const workitem_type = (acceptedStatus === true) ?
            "accepted" : "review";
    return (
      <table className="table" id={id}>
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
            price = this.roundCurrency(item.price);
            cost = this.roundCurrency(item.quantity * price);
            total += cost;
            return (
              <tr key={workitem_type + "_" + index}>
                <td>{item.description}</td>
                <td>{price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>{item.vendor}</td>
                <td>{cost.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th className="col-sm-10">Total</th>
            <td></td>
            <td></td>
            <td></td>
            <td className="col-sm-2">{total.toFixed(2)}</td>
          </tr>
          {(acceptedStatus == true) ? 
          (<tr>
            <th className="col-sm-10">Grand Total</th>
            <td></td>
            <td></td>
            <td></td>
            <td className="col-sm-2">
              {(total + this.state.portaPottyCost + this.state.wasteCost).toFixed(2)}
            </td>
          </tr>) : (null)}
        </tfoot>
      </table>
    );
  };
  onClick_exportReviewCSV = () => {
    let tableId = this.reviewProjectItemsTableId;
    let tableText = functionHelper.getTableText(tableId);
    functionHelper.exportCSV(this.state.name + " review_materials_list_review_", tableText);
  };

  onClick_exportProjectCSV = () => {
    let tableId = this.projectItemsTableId;
    let tableText = functionHelper.getTableText(tableId);
    functionHelper.exportCSV(this.state.name + " materials_list_review_", tableText);
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
                <th className="col-xs-6 col-lg-4">Porta Potty Cost</th>
                <td className="col-xs-6 col-lg-4">{this.state.portaPottyCost}</td>
              </tr>
              <tr>
                <th className="col-xs-6 col-lg-4">Waste Disposal Cost</th>
                <td className="col-xs-6 col-lg-4">{this.state.wasteCost}</td>
              </tr>
              <tr>
                <td>
                  <h3>Materials Lists <button 
                          className="btn btn-sm btn-primary" 
                          onClick={this.onClick_exportProjectCSV}>Export CSV</button></h3>
                  {this.create_materialsitems_table(true)}
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
                    <h2>Materials Lists <button 
                            className="btn btn-sm btn-primary" 
                            onClick={this.onClick_exportReviewCSV}>Export CSV</button>
                    </h2>
                    {this.create_materialsitems_table(false)}
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