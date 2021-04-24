var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { ApplicationReport };

import { functionHelper } from "./functionHelper.js";

var ApplicationReport = function (_React$Component) {
  _inherits(ApplicationReport, _React$Component);

  function ApplicationReport(props) {
    _classCallCheck(this, ApplicationReport);

    var _this = _possibleConstructorReturn(this, (ApplicationReport.__proto__ || Object.getPrototypeOf(ApplicationReport)).call(this, props));

    _this.searchForm = function (e) {
      e.preventDefault();
      $.ajax({
        url: "/app_project/report/applications",
        type: "POST",
        data: functionHelper.get_data(_this.formId),
        context: _this,
        success: function success(applications) {
          console.log(applications);
          this.setState({
            applications: applications
          });
        }
      });
    };

    _this.createApplicationInfoTable = function () {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h3",
          null,
          "Applications Info"
        ),
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
                "# Applications"
              ),
              React.createElement(
                "td",
                null,
                _this.state.applications.length
              )
            )
          )
        )
      );
    };

    _this.createApplicationTable = function () {
      return React.createElement(
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
              "Name"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Application Date"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Location"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          _this.state.applications.map(function (document) {
            return React.createElement(
              "tr",
              { key: document._id },
              React.createElement(
                "td",
                null,
                React.createElement(
                  "a",
                  { href: "/view/" + document._id, target: "_blank" },
                  document.application.name.first + " " + document.application.name.last
                )
              ),
              React.createElement(
                "td",
                null,
                functionHelper.convert_date(document.created).toLocaleDateString()
              ),
              React.createElement(
                "td",
                null,
                document.application.address.city
              )
            );
          })
        )
      );
    };

    _this.formId = "application-form";
    _this.state = {
      applications: []
    };
    return _this;
  }

  _createClass(ApplicationReport, [{
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
            "Application Submit Date"
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
        this.createApplicationInfoTable(),
        React.createElement(
          "h3",
          null,
          "Applications"
        ),
        this.createApplicationTable()
      );
    }
  }]);

  return ApplicationReport;
}(React.Component);