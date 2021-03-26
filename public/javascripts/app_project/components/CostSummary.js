var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { CostSummary };

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

    _this.loadWorkItems = function (data_type, workItems) {
      var accepted_project_materials = [],
          num_accepted_project_workitems = 0,
          accepted_project_volunteers = 0,
          num_review_project_workitems = 0,
          review_project_materials = [],
          review_project_volunteers = 0,
          i = void 0,
          j = void 0,
          item_arr = void 0;
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
        data_type: data_type
      });
    };

    _this.load_project_data = function (project_id) {
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        context: _this,
        success: function success(projectData) {
          this.loadWorkItems("project", projectData.workItems);
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
          this.loadWorkItems("site_assessment", siteAssessmentData.workItems);
        }
      });
    };

    _this.create_materialsitems_table = function (workitem_type) {
      var arr = workitem_type == "accepted" ? _this.state.accepted_project_materials : _this.state.review_project_materials,
          total = 0;
      return React.createElement(
        "table",
        { className: "table" },
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
            total += item.quantity * item.price;
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
                item.price
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
                item.quantity * item.price
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
              null,
              "Total"
            ),
            React.createElement(
              "td",
              null,
              total
            )
          )
        )
      );
    };

    _this.state = {
      data_type: "site_assessment",
      num_accepted_project_workitems: 0,
      accepted_project_materials: [],
      accepted_project_volunteers: 0,

      num_review_project_workitems: 0,
      review_project_materials: [],
      review_project_volunteers: 0
    };
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

  /**
   * Creates the materials item table for the Cost Summary
   * @param {String} workitem_type 
   * @returns Table element
   */


  _createClass(CostSummary, [{
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
                  "td",
                  null,
                  React.createElement(
                    "h3",
                    null,
                    "Materials Lists"
                  ),
                  this.create_materialsitems_table("accepted")
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
                    "Materials Lists"
                  ),
                  this.create_materialsitems_table("review")
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