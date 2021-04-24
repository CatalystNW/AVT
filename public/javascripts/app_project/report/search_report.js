var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { SearchReport };

import { functionHelper } from "./functionHelper.js";

var SearchReport = function (_React$Component) {
  _inherits(SearchReport, _React$Component);

  function SearchReport(props) {
    _classCallCheck(this, SearchReport);

    var _this = _possibleConstructorReturn(this, (SearchReport.__proto__ || Object.getPrototypeOf(SearchReport)).call(this, props));

    _this.searchForm = function (e) {
      e.preventDefault();
      console.log(functionHelper.get_data(_this.searchFormId));
      $.ajax({
        url: "/app_project/report/search",
        type: "POST",
        data: functionHelper.get_data(_this.searchFormId),
        context: _this,
        success: function success(projects) {
          console.log(projects);
          this.setState({
            projects: projects
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