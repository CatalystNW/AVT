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

    _this.load_project_data = function (project_id) {
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        context: _this,
        success: function success(projectData) {
          var workItems = projectData.workItems;
          var project_materials = [],
              num_project_workitems = workItems.length,
              project_volunteers = 0;

          var i = void 0,
              j = void 0;

          for (i = 0; i < workItems.length; i++) {
            if (workItems[i].volunteers_required) {
              project_volunteers += workItems[i].volunteers_required;
            }
            for (j = 0; j < workItems[i].materialsItems.length; j++) {
              project_materials.push(workItems[i].materialsItems[j]);
            }
          }
          this.setState({
            data_type: "project",
            num_project_workitems: num_project_workitems,
            project_materials: project_materials,
            proj_volunteers: project_volunteers
          });
        }
      });
    };

    _this.load_site_assessment_data = function (assessment_id) {
      var that = _this;
      funkie.get_assessment(assessment_id, function (siteAssessmentData) {
        var project_materials = [],
            num_project_workitems = 0,
            proj_volunteers = 0;
        console.log(siteAssessmentData);
        var workItems = siteAssessmentData.workItems,
            i,
            j,
            item_arr;
        for (i = 0; i < workItems.length; i++) {
          if (workItems[i].status != "accepted") {
            continue;
          }
          item_arr = project_materials;
          num_project_workitems += 1;
          if (workItems[i].volunteers_required) {
            proj_volunteers += workItems[i].volunteers_required;
          }
          for (j = 0; j < workItems[i].materialsItems.length; j++) {
            item_arr.push(workItems[i].materialsItems[j]);
          }
        }
        that.setState({
          num_project_workitems: num_project_workitems,
          project_materials: project_materials,
          proj_volunteers: proj_volunteers,
          data_type: "site_assessment"
        });
      });
    };

    _this.create_materialsitems_table = function (workitem_type) {
      var arr = _this.state.project_materials,
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
              "td",
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
      num_project_workitems: 0,
      project_materials: [],
      proj_volunteers: 0,
      data_type: "site_assessment"
    };
    return _this;
  }

  _createClass(CostSummary, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
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
                { className: "col-xs-8" },
                "# Project Work Items Accepted"
              ),
              React.createElement(
                "td",
                { className: "col-xs-4" },
                this.state.num_project_workitems
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
                this.create_materialsitems_table("project")
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-8" },
                "Volunteers Req."
              ),
              React.createElement(
                "td",
                { className: "col-xs-4" },
                this.state.proj_volunteers
              )
            )
          )
        )
      );
    }
  }]);

  return CostSummary;
}(React.Component);