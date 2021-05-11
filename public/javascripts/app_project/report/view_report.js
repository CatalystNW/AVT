var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { CurrentProjects } from "./current_projects.js";
import { ProjectReport } from "./project_report.js";
import { ApplicationReport } from "./application_report.js";
import { SearchReport } from "./search_report.js";

var ReportApp = function (_React$Component) {
  _inherits(ReportApp, _React$Component);

  function ReportApp(props) {
    _classCallCheck(this, ReportApp);

    var _this = _possibleConstructorReturn(this, (ReportApp.__proto__ || Object.getPrototypeOf(ReportApp)).call(this, props));

    _this.createTabs = function () {
      return (
        //<div>
        React.createElement(
          "ul",
          { className: "nav nav-tabs" },
          React.createElement(
            "li",
            { className: "nav-item" },
            React.createElement(
              "a",
              { className: "nav-link active", href: "#upcomingReport", role: "tab", "data-toggle": "tab" },
              "Current Projects"
            )
          ),
          React.createElement(
            "li",
            { className: "nav-item" },
            React.createElement(
              "a",
              { className: "nav-link", href: "#project-report", role: "tab", "data-toggle": "tab" },
              "Completed Projects"
            )
          ),
          React.createElement(
            "li",
            { className: "nav-item" },
            React.createElement(
              "a",
              { className: "nav-link", href: "#applications-report", role: "tab", "data-toggle": "tab" },
              "Applications"
            )
          ),
          React.createElement(
            "li",
            { className: "nav-item" },
            React.createElement(
              "a",
              { className: "nav-link", href: "#search-report", role: "tab", "data-toggle": "tab" },
              "Search"
            )
          )
        )
        //</div>

      );
    };

    _this.createPages = function () {
      return React.createElement(
        "div",
        { className: "tab-content", id: "myTabContent" },
        React.createElement(
          "div",
          { className: "tab-pane show active", id: "upcomingReport", role: "tabpanel" },
          React.createElement(CurrentProjects, null)
        ),
        React.createElement(
          "div",
          { className: "tab-pane", id: "project-report", role: "tabpanel" },
          React.createElement(ProjectReport, null)
        ),
        React.createElement(
          "div",
          { className: "tab-pane", id: "applications-report", role: "tabpanel" },
          React.createElement(ApplicationReport, null)
        ),
        React.createElement(
          "div",
          { className: "tab-pane", id: "search-report", role: "tabpanel" },
          React.createElement(SearchReport, null)
        )
      );
    };

    return _this;
  }

  _createClass(ReportApp, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.createTabs(),
        this.createPages()
      );
    }
  }]);

  return ReportApp;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(ReportApp, null), document.getElementById("mainContainer"));
}

loadReact();