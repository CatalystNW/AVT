var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { CurrentProjects };

import { functionHelper } from "../functionHelper.js";

var CurrentProjects = function (_React$Component) {
  _inherits(CurrentProjects, _React$Component);

  function CurrentProjects(props) {
    _classCallCheck(this, CurrentProjects);

    var _this = _possibleConstructorReturn(this, (CurrentProjects.__proto__ || Object.getPrototypeOf(CurrentProjects)).call(this, props));

    _this.loadData = function () {
      $.ajax({
        url: "/app_project/report/current",
        type: "GET",
        context: _this,
        success: function success(projectsData) {
          console.log(projectsData);
          var projects = [],
              handleits = [];

          projectsData.forEach(function (project) {
            // Convert project.start from date string to date object
            if (project.start) {
              project.start = functionHelper.convert_date(project.start);
            }

            if (project.handleit) {
              handleits.push(project);
            } else {
              projects.push(project);
            }
          });
          // Sort projects by project.start
          projects.sort(functionHelper.date_sorter);
          handleits.sort(functionHelper.date_sorter);

          this.setState({
            projects: projects,
            handleits: handleits
          });
        }
      });
    };

    _this.onClick_exportHandleitCSV = function () {
      var projectDataArray = functionHelper.getTableText(_this.handleitTableId);
      functionHelper.exportCSV("upcoming-handleits-", projectDataArray);
    };

    _this.onClick_exportProjectCSV = function () {
      var projectDataArray = functionHelper.getTableText(_this.projectTableId);
      functionHelper.exportCSV("upcoming-projects-", projectDataArray);
    };

    _this.onClick_combinedProjectsCSV = function () {
      var projectDataArray = [["Handle-It"]].concat(functionHelper.getTableText(_this.handleitTableId));

      projectDataArray = projectDataArray.concat([["Projects"]], functionHelper.getTableText(_this.projectTableId));
      functionHelper.exportCSV("upcoming-combined-projects-", projectDataArray);
    };

    _this.exportCSV = function (filename, dataArray) {
      var csvContent = "data:text/csv;charset=utf-8," + dataArray.map(function (row) {
        return row.join(",");
      }).join("\n");
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      var dateString = new Date().toISOString().replace(/T.*/, '');
      link.setAttribute("download", filename + dateString + ".csv");
      document.body.appendChild(link);
      link.click();
    };

    _this.state = {
      projects: [],
      handleits: []
    };
    _this.projectTableId = "project-table";
    _this.handleitTableId = "handleit-table";
    _this.loadData();
    return _this;
  }

  _createClass(CurrentProjects, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          "Current Projects"
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "label",
            { className: "m-1" },
            "Download CSV: "
          ),
          React.createElement(
            "button",
            { className: "btn btn-sm btn-primary",
              onClick: this.onClick_combinedProjectsCSV },
            "Combined"
          ),
          React.createElement(
            "button",
            { className: "btn btn-sm btn-secondary",
              onClick: this.onClick_exportHandleitCSV },
            "Handle-it"
          ),
          React.createElement(
            "button",
            { className: "btn btn-sm btn-success",
              onClick: this.onClick_exportProjectCSV },
            "Project"
          )
        ),
        React.createElement(
          "h2",
          null,
          "Handle-It Projects"
        ),
        functionHelper.createTable(this.handleitTableId, this.state.handleits),
        React.createElement(
          "h2",
          null,
          "Projects"
        ),
        functionHelper.createTable(this.projectTableId, this.state.projects)
      );
    }
  }]);

  return CurrentProjects;
}(React.Component);