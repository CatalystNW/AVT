var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { ProjectReport };

import { functionHelper } from "../functionHelper.js";

var ProjectReport = function (_React$Component) {
  _inherits(ProjectReport, _React$Component);

  function ProjectReport(props) {
    _classCallCheck(this, ProjectReport);

    var _this = _possibleConstructorReturn(this, (ProjectReport.__proto__ || Object.getPrototypeOf(ProjectReport)).call(this, props));

    _this.searchForm = function (e) {
      e.preventDefault();
      $.ajax({
        url: "/app_project/report/project",
        type: "POST",
        data: functionHelper.get_data(_this.formId),
        context: _this,
        success: function success(projects) {
          console.log(projects);
          // Convert project.start from date string to date object
          for (var i = 0; i < projects.length; i++) {
            if (projects[i].start) {
              projects[i].start = functionHelper.convert_date(projects[i].start);
            }
          }
          // Sort projects by project.start
          projects.sort(functionHelper.date_sorter);

          this.setState({
            projects: projects
          });
        }
      });
    };

    _this.createPartnersTable = function () {
      var partnersDict = {};
      _this.state.projects.forEach(function (project) {
        project.partners.forEach(function (partner) {
          if (partner.org_name in partnersDict) {
            partnersDict[partner.org_name] += 1;
          } else {
            partnersDict[partner.org_name] = 1;
          }
        });
      });

      var partnersArray = [];
      var tr = void 0;
      for (var name in partnersDict) {
        partnersArray.push(React.createElement(
          "tr",
          { key: "part-" + name },
          React.createElement(
            "td",
            null,
            name
          ),
          React.createElement(
            "td",
            null,
            partnersDict[name]
          )
        ));
      }

      return React.createElement(
        "div",
        null,
        React.createElement(
          "h2",
          null,
          "Partners"
        ),
        React.createElement(
          "table",
          { className: "table table-sm" },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { scope: "col" },
                "Partner"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Number of Projects"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            partnersArray
          )
        )
      );
    };

    _this.createProjectInfoTable = function () {
      var num_handleits = 0,
          num_projects = 0,
          num_volunteers = 0,
          cost = 0,
          volunteer_hours = 0;
      _this.state.projects.forEach(function (project) {
        volunteer_hours += project.volunteer_hours;
        if (project.handleit) {
          num_handleits++;
        } else {
          num_projects++;
        }

        project.workItems.forEach(function (workItem) {
          workItem.materialsItems.map(function (materialsItem) {
            cost += materialsItem.price * materialsItem.quantity;
          });
          num_volunteers += workItem.volunteers_required;
        });
      });
      cost = functionHelper.roundCurrency(cost);

      return React.createElement(
        "div",
        null,
        React.createElement(
          "h2",
          null,
          "Project Info"
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "table",
            { className: "table table-sm info-table" },
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row" },
                  "# Handle-it Projects"
                ),
                React.createElement(
                  "td",
                  null,
                  num_handleits
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row" },
                  "# Projects"
                ),
                React.createElement(
                  "td",
                  null,
                  num_projects
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row" },
                  "Total Volunteers"
                ),
                React.createElement(
                  "td",
                  null,
                  num_volunteers
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row" },
                  "Total Cost"
                ),
                React.createElement(
                  "td",
                  null,
                  cost.toFixed(2)
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row" },
                  "Total Labor Hours"
                ),
                React.createElement(
                  "td",
                  null,
                  volunteer_hours
                )
              )
            )
          )
        )
      );
    };

    _this.onClick_csv = function () {
      var projectDataArray = functionHelper.getTableText(_this.projectTableId);
      functionHelper.exportCSV("projects-report-", projectDataArray);
    };

    _this.formId = "projects-report-form";
    _this.state = {
      projects: []
    };
    _this.projectTableId = "projets-table";
    return _this;
  }

  _createClass(ProjectReport, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $(".datepicker").datepicker({
        orientation: 'bottom',
        format: 'yyyy-mm-dd'
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "form",
          { onSubmit: this.searchForm, id: this.formId },
          React.createElement(
            "h3",
            null,
            "Start Date"
          ),
          React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
              "div",
              { className: "col-md-3" },
              React.createElement(
                "label",
                null,
                "Start"
              ),
              React.createElement("input", { type: "text", className: "datepicker form-control",
                placeholder: "yyyy-mm-dd", name: "startDate" })
            ),
            React.createElement(
              "div",
              { className: "col-md-3" },
              React.createElement(
                "label",
                null,
                "End"
              ),
              React.createElement("input", { type: "text", className: "datepicker form-control",
                placeholder: "yyyy-mm-dd", name: "endDate" })
            )
          ),
          React.createElement(
            "button",
            { type: "submit", className: "btn btn-primary" },
            "Search"
          )
        ),
        this.createPartnersTable(),
        this.createProjectInfoTable(),
        React.createElement(
          "h2",
          null,
          "Projects",
          React.createElement(
            "button",
            { onClick: this.onClick_csv,
              className: "btn btn-sm btn-success" },
            "CSV"
          )
        ),
        functionHelper.createTable(this.projectTableId, this.state.projects, true)
      );
    }
  }]);

  return ProjectReport;
}(React.Component);