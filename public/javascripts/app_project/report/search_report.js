var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { SearchReport };

import { functionHelper } from "../functionHelper.js";

var SearchReport = function (_React$Component) {
  _inherits(SearchReport, _React$Component);

  function SearchReport(props) {
    _classCallCheck(this, SearchReport);

    var _this = _possibleConstructorReturn(this, (SearchReport.__proto__ || Object.getPrototypeOf(SearchReport)).call(this, props));

    _this.filterProjects = function (projects, options) {
      console.log(options.cost.length);
      if (options.volunteers && options.volunteers.length > 0 || options.hours && options.hours.length > 0 || options.cost && options.cost.length > 0) {
        var newProjects = [],
            cost = void 0,
            hours = void 0,
            volunteers = void 0;
        projects.forEach(function (project) {
          cost = 0;
          hours = 0;
          volunteers = project.volunteer_hours;;
          project.workItems.forEach(function (workItem) {
            workItem.materialsItems.forEach(function (materialsItem) {
              cost += materialsItem.price * materialsItem.quantity;
            });
            volunteers += workItem.volunteers_required;
            hours += project.volunteer_hours;
          });
          if (options.volunteers && options.volunteers.length > 0) {
            if (options.volunteers_options == "gte") {
              if (volunteers < options.volunteers) return;
            } else {
              if (volunteers > options.volunteers) return;
            }
          }
          if (options.hours && options.hours.length > 0) {
            if (options.hours_options == "gte") {
              if (hours < options.hours) return;
            } else {
              if (hours > options.hours) return;
            }
          }
          if (options.cost && options.cost.length > 0) {
            if (options.cost_options == "gte") {
              if (cost < options.cost) return;
            } else {
              if (cost > options.cost) return;
            }
          }
          newProjects.push(project);
        });
        return newProjects;
      } else {
        return projects;
      }
    };

    _this.searchForm = function (e) {
      e.preventDefault();
      var options = functionHelper.get_data(_this.searchFormId);
      $.ajax({
        url: "/app_project/report/search",
        type: "POST",
        data: options,
        context: _this,
        success: function success(projects) {
          this.setState({
            projects: this.filterProjects(projects, options)
          });
        }
      });
    };

    _this.resetForm = function () {
      document.getElementById(_this.searchFormId).reset();
    };

    _this.createForm = function () {
      return React.createElement(
        "form",
        { id: _this.searchFormId, onSubmit: _this.searchForm },
        React.createElement(
          "h3",
          null,
          "Application Info"
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "First Name"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "first_name" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Last Name"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "last_name" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "City"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "city" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Zip Code"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "zip" })
          )
        ),
        React.createElement(
          "h3",
          null,
          "Project Date"
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Begin - Start"
            ),
            React.createElement("input", { type: "text", className: "datepicker form-control",
              placeholder: "yyyy-mm-dd", name: "project_start_start" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Begin - End"
            ),
            React.createElement("input", { type: "text", className: "datepicker form-control",
              placeholder: "yyyy-mm-dd", name: "project_start_end" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "End - Start"
            ),
            React.createElement("input", { type: "text", className: "datepicker form-control",
              placeholder: "yyyy-mm-dd", name: "project_end_start" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "End - End"
            ),
            React.createElement("input", { type: "text", className: "datepicker form-control",
              placeholder: "yyyy-mm-dd", name: "project_end_end" })
          )
        ),
        React.createElement(
          "h3",
          null,
          "Application Date"
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Start"
            ),
            React.createElement("input", { type: "text", className: "datepicker form-control",
              placeholder: "yyyy-mm-dd", name: "application_start_start" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "End"
            ),
            React.createElement("input", { type: "text", className: "datepicker form-control",
              placeholder: "yyyy-mm-dd", name: "appliation_start_end" })
          )
        ),
        React.createElement(
          "h3",
          null,
          "Project Leaders"
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Site Host"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "site_host" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Project Advocate"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "project_advocate" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Crew Chief"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "crew_chief" })
          ),
          React.createElement(
            "label",
            null,
            "AND"
          ),
          React.createElement("input", { type: "radio", name: "leaders_option", value: "and", defaultChecked: true }),
          React.createElement(
            "label",
            null,
            "OR"
          ),
          React.createElement("input", { type: "radio", name: "leaders_option", value: "or" })
        ),
        React.createElement(
          "h3",
          null,
          "Project Options"
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Project Name"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "project_name" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Number Volunteers"
            ),
            React.createElement("input", { className: "form-control", type: "number", name: "volunteers" }),
            React.createElement(
              "label",
              null,
              "Less Than"
            ),
            React.createElement("input", { type: "radio", name: "volunteers_options", value: "gte", defaultChecked: true }),
            React.createElement(
              "label",
              null,
              "Greater Than"
            ),
            React.createElement("input", { type: "radio", name: "volunteers_options", value: "lte" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Cost"
            ),
            React.createElement("input", { className: "form-control", type: "number", name: "cost" }),
            React.createElement(
              "label",
              null,
              "Less Than"
            ),
            React.createElement("input", { type: "radio", name: "cost_options", value: "gte", defaultChecked: true }),
            React.createElement(
              "label",
              null,
              "Greater Than"
            ),
            React.createElement("input", { type: "radio", name: "cost_options", value: "lte" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Total Hours Volunteered"
            ),
            React.createElement("input", { className: "form-control", type: "number", name: "hours" }),
            React.createElement(
              "label",
              null,
              "Less Than"
            ),
            React.createElement("input", { type: "radio", name: "hours_options", value: "gte", defaultChecked: true }),
            React.createElement(
              "label",
              null,
              "Greater Than"
            ),
            React.createElement("input", { type: "radio", name: "hours_options", value: "lte" })
          )
        ),
        React.createElement(
          "button",
          { type: "submit" },
          "Submit"
        ),
        React.createElement(
          "button",
          { onClick: _this.resetForm, type: "button" },
          "Clear Form"
        )
      );
    };

    _this.createApplicationsTable = function () {
      return React.createElement(
        "div",
        null,
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
                "Project"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Handle-it"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Applicant"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Address"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Zip"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Status"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "App ID"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "SH"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "PA"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "CC"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            _this.state.projects.map(function (project) {
              return React.createElement(
                "tr",
                { key: project._id },
                React.createElement(
                  "td",
                  null,
                  !project.name || project.name.length == 0 ? React.createElement(
                    "a",
                    { href: "/app_project/view_projects/" + project._id, target: "_blank" },
                    "N/A"
                  ) : React.createElement(
                    "a",
                    { href: "/app_project/view_projects/" + project._id, target: "_blank" },
                    project.name
                  )
                ),
                React.createElement(
                  "td",
                  null,
                  project.handleit ? "Yes" : "No"
                ),
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "a",
                    { href: "/view/" + project.documentPackage._id, target: "_blank" },
                    project.documentPackage.application.name.first + " " + project.documentPackage.application.name.last
                  )
                ),
                React.createElement(
                  "td",
                  null,
                  project.documentPackage.application.address.city,
                  ", ",
                  project.documentPackage.application.address.state
                ),
                React.createElement(
                  "td",
                  null,
                  project.documentPackage.application.address.zip
                ),
                React.createElement(
                  "td",
                  null,
                  project.documentPackage.applicationStatus
                ),
                React.createElement(
                  "td",
                  null,
                  project.documentPackage.app_name
                ),
                React.createElement(
                  "td",
                  null,
                  project.site_host
                ),
                React.createElement(
                  "td",
                  null,
                  project.project_advocate
                ),
                React.createElement(
                  "td",
                  null,
                  project.crew_chief
                )
              );
            })
          )
        )
      );
    };

    _this.state = {
      projects: []
    };
    _this.searchFormId = "search-applications-form";
    return _this;
  }

  _createClass(SearchReport, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.createForm(),
        this.createApplicationsTable()
      );
    }
  }]);

  return SearchReport;
}(React.Component);