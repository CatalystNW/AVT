var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { CostSummary };

import { functionHelper } from "../functionHelper.js";

var CostSummary = function (_React$Component) {
  _inherits(CostSummary, _React$Component);

  function CostSummary(props) {
    _classCallCheck(this, CostSummary);

    var _this = _possibleConstructorReturn(this, (CostSummary.__proto__ || Object.getPrototypeOf(CostSummary)).call(this, props));

    _this.load_data = function (data_type, id) {
      if (data_type == "site_assessment") {
        _this.load_site_assessment_data(id);
      } else if (data_type == "project") {
        _this.load_project_data(id);
      }
    };

    _this.loadDataToState = function (data_type, projectOrAssessment) {
      var workItems = projectOrAssessment.workItems;
      var accepted_project_materials = [],
          num_accepted_project_workitems = 0,
          accepted_project_volunteers = 0,
          num_review_project_workitems = 0,
          review_project_materials = [],
          review_project_volunteers = 0,
          i = void 0,
          j = void 0,
          item_arr = void 0;

      var wasteCost = 0,
          portaPottyCost = 0;
      if (projectOrAssessment.porta_potty_required) {
        portaPottyCost = projectOrAssessment.porta_potty_cost;
      }
      if (projectOrAssessment.waste_required) {
        wasteCost = projectOrAssessment.waste_cost;
      }

      for (i = 0; i < workItems.length; i++) {
        if (workItems[i].status == "declined") {
          continue;
        }
        if (data_type == "site_assessment" && workItems[i].status == "to_review") {
          item_arr = review_project_materials;
          num_review_project_workitems += 1;
          if (workItems[i].volunteers_required) {
            review_project_volunteers += workItems[i].volunteers_required;
          }
        } else {
          // Project Work Items (whether handleit or not) will show everything here
          // and accepted assess. work items
          item_arr = accepted_project_materials;
          num_accepted_project_workitems += 1;
          if (workItems[i].volunteers_required) {
            accepted_project_volunteers += workItems[i].volunteers_required;
          }
        }

        for (j = 0; j < workItems[i].materialsItems.length; j++) {
          item_arr.push(workItems[i].materialsItems[j]);
        }
      }
      _this.setState({
        num_accepted_project_workitems: num_accepted_project_workitems,
        accepted_project_materials: accepted_project_materials,
        accepted_project_volunteers: accepted_project_volunteers,

        num_review_project_workitems: num_review_project_workitems,
        review_project_materials: review_project_materials,
        review_project_volunteers: review_project_volunteers,
        data_type: data_type,

        wasteCost: wasteCost,
        portaPottyCost: portaPottyCost,
        name: projectOrAssessment.documentPackage.application.name.first + " " + projectOrAssessment.documentPackage.application.name.last
      });
    };

    _this.load_project_data = function (project_id) {
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        context: _this,
        success: function success(projectData) {
          console.log(projectData);
          this.loadDataToState("project", projectData);
        }
      });
    };

    _this.load_site_assessment_data = function (assessment_id) {
      $.ajax({
        type: "GET",
        url: "/app_project/site_assessments/" + assessment_id,
        context: _this,
        success: function success(siteAssessmentData) {
          console.log(siteAssessmentData);
          this.loadDataToState("site_assessment", siteAssessmentData);
        }
      });
    };

    _this.create_materialsitems_table = function (acceptedStatus) {
      var arr = acceptedStatus === true ? _this.state.accepted_project_materials : _this.state.review_project_materials,
          total = 0,
          cost = void 0,
          price = void 0,
          id = acceptedStatus === true ? _this.projectItemsTableId : _this.reviewProjectItemsTableId;
      var workitem_type = acceptedStatus === true ? "accepted" : "review";
      return React.createElement(
        "table",
        { className: "table", id: id },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { scope: "col" },
              "Description"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Price"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Count"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Vendor"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Total"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          arr.map(function (item, index) {
            price = _this.roundCurrency(item.price);
            cost = _this.roundCurrency(item.quantity * price);
            total += cost;
            return React.createElement(
              "tr",
              { key: workitem_type + "_" + index },
              React.createElement(
                "td",
                null,
                item.description
              ),
              React.createElement(
                "td",
                null,
                price.toFixed(2)
              ),
              React.createElement(
                "td",
                null,
                item.quantity
              ),
              React.createElement(
                "td",
                null,
                item.vendor
              ),
              React.createElement(
                "td",
                null,
                cost.toFixed(2)
              )
            );
          })
        ),
        React.createElement(
          "tfoot",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { className: "col-sm-10" },
              "Total"
            ),
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement(
              "td",
              { className: "col-sm-2" },
              total.toFixed(2)
            )
          ),
          acceptedStatus == true ? React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { className: "col-sm-10" },
              "Grand Total"
            ),
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement("td", null),
            React.createElement(
              "td",
              { className: "col-sm-2" },
              (total + _this.state.portaPottyCost + _this.state.wasteCost).toFixed(2)
            )
          ) : null
        )
      );
    };

    _this.onClick_exportReviewCSV = function () {
      var tableId = _this.reviewProjectItemsTableId;
      var tableText = functionHelper.getTableText(tableId);
      functionHelper.exportCSV(_this.state.name + " review_materials_list_review_", tableText);
    };

    _this.onClick_exportProjectCSV = function () {
      var tableId = _this.projectItemsTableId;
      var tableText = functionHelper.getTableText(tableId);
      functionHelper.exportCSV(_this.state.name + " materials_list_review_", tableText);
    };

    _this.state = {
      data_type: "site_assessment",
      num_accepted_project_workitems: 0,
      accepted_project_materials: [],
      accepted_project_volunteers: 0,

      portaPottyCost: 0,
      wasteCost: 0,

      num_review_project_workitems: 0,
      review_project_materials: [],
      review_project_volunteers: 0
    };

    _this.projectItemsTableId = "proj-mi-table";
    _this.reviewProjectItemsTableId = "review-proj-mi-table";
    return _this;
  }

  /**
   * Loads either project or assessment data depending on
   * data_type and id parameters.
   * 
   * Does so using load_site_asssessment_data or load_project_data
   * @param {String} data_type "site_assessment" or "project"
   * @param {String} id ID of the project or assessment to be loaded
   */

  /**
   * Loads project data from the server and saves it into state:
   * data_type, num_accepted_project_workitems, accepted_project_materials, and accepted_project_volunteers
   * @param {String} project_id ID of project
   */

  /**
   * Loads site assessment data from the server and saves it into state:
   * data_type, num_accepted_project_workitems, accepted_project_materials, and accepted_project_volunteers
   * @param {String} assessment_id ID of site assessment
   */


  _createClass(CostSummary, [{
    key: "roundCurrency",
    value: function roundCurrency(n) {
      var mult = 100,
          value = void 0;
      value = parseFloat((n * mult).toFixed(6));
      return Math.round(value) / mult;
    }

    /**
     * Creates the materials item table for the Cost Summary
     * @param {String} acceptedStatus True to create the accepted
     *  work items. Else, the work items in review.
     * @returns Table element
     */

  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          null,
          this.state.data_type == "site_assessment" ? React.createElement(
            "h2",
            null,
            "Project Work Items Accepted"
          ) : React.createElement(
            "h2",
            null,
            "Project Work Items"
          ),
          React.createElement(
            "table",
            { className: "table" },
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "col-xs-6 col-lg-4" },
                  "# Work Items"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-lg-4" },
                  this.state.num_accepted_project_workitems
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "col-xs-6 col-lg-4" },
                  "Volunteers Required"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-lg-4" },
                  this.state.accepted_project_volunteers
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "col-xs-6 col-lg-4" },
                  "Porta Potty Cost"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-lg-4" },
                  this.state.portaPottyCost
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "col-xs-6 col-lg-4" },
                  "Waste Disposal Cost"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-lg-4" },
                  this.state.wasteCost
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "h3",
                    null,
                    "Materials Lists ",
                    React.createElement(
                      "button",
                      {
                        className: "btn btn-sm btn-primary",
                        onClick: this.onClick_exportProjectCSV },
                      "Export CSV"
                    )
                  ),
                  this.create_materialsitems_table(true)
                )
              )
            )
          )
        ),
        this.state.data_type == "site_assessment" ? React.createElement(
          "div",
          null,
          React.createElement(
            "h2",
            null,
            "Project Work Items In Review"
          ),
          React.createElement(
            "table",
            { className: "table" },
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "col-xs-6 col-lg-4" },
                  "# Work Items"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-lg-4" },
                  this.state.num_review_project_workitems
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { className: "col-xs-6 col-lg-4" },
                  "Volunteers Required"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-lg-4" },
                  this.state.review_project_volunteers
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "h2",
                    null,
                    "Materials Lists ",
                    React.createElement(
                      "button",
                      {
                        className: "btn btn-sm btn-primary",
                        onClick: this.onClick_exportReviewCSV },
                      "Export CSV"
                    )
                  ),
                  this.create_materialsitems_table(false)
                )
              )
            )
          )
        ) : null
      );
    }
  }]);

  return CostSummary;
}(React.Component);