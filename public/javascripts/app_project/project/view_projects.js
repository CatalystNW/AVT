var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { functionHelper } from "../functionHelper.js";

var AppProjects = function (_React$Component) {
  _inherits(AppProjects, _React$Component);

  function AppProjects(props) {
    _classCallCheck(this, AppProjects);

    var _this = _possibleConstructorReturn(this, (AppProjects.__proto__ || Object.getPrototypeOf(AppProjects)).call(this, props));

    _this.get_projects = function () {
      var that = _this;
      $.ajax({
        url: "./projects",
        type: "GET",
        success: function success(projects) {
          console.log(projects);
          var yearSet = new Set(),
              year = void 0;

          // Convert project.date to project>startDate (with date obj) &&
          // Add to state.compleetYears
          projects.forEach(function (project) {
            project.startDate = functionHelper.convert_date(project.start);
            if (project.startDate && project.status == "complete") {
              year = project.startDate.getFullYear();
              if (year && !yearSet.has(year)) {
                yearSet.add(parseInt(year));
              }
            }
          });
          that.setState({
            completeYears: Array.from(yearSet).sort().reverse(),
            projects: projects
          });
        }
      });
    };

    _this.createProjectRows = function (status, filterStatus) {
      var projects = [];
      var doc = void 0,
          app = void 0,
          address = void 0,
          handleitColumn = void 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this.state.projects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var project = _step.value;

          if (project.status == "complete" && _this.state.selectedCompleteYear != "all" && (project.startDate == null || project.startDate.getFullYear() != _this.state.selectedCompleteYear)) {
            continue;
          }
          if (project.status != status) continue;
          if (filterStatus == 2 && project.handleit || filterStatus == 1 && !project.handleit) {
            continue;
          }
          doc = project.documentPackage;
          app = doc.application;
          address = app.address.city + ", " + app.address.state;
          // show column only when both handleit & projects are shown
          handleitColumn = filterStatus == 0 ? React.createElement(
            "td",
            { className: "col-sm-1" },
            project.handleit ? "✔️" : ""
          ) : null;
          projects.push(React.createElement(
            "tr",
            { key: project._id },
            React.createElement(
              "td",
              { className: "col-sm-2" },
              React.createElement(
                "a",
                { href: "./view_projects/" + project._id },
                project.name && project.name.length > 0 ? project.name : "N/A"
              )
            ),
            handleitColumn,
            React.createElement(
              "td",
              { className: "col-sm-2" },
              app.name.first,
              " ",
              app.name.last
            ),
            React.createElement(
              "td",
              { className: "col-sm-2" },
              address
            ),
            React.createElement(
              "td",
              { className: "col-sm-2" },
              project.startDate ? project.startDate.toLocaleDateString() : ""
            ),
            React.createElement(
              "td",
              { className: "col-sm-1" },
              project.crew_chief
            ),
            React.createElement(
              "td",
              { className: "col-sm-1" },
              project.project_advocate
            ),
            React.createElement(
              "td",
              { className: "col-sm-1" },
              project.site_host
            )
          ));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return projects;
    };

    _this.onClickProjectHeader = function (e) {
      e.preventDefault();
      var status = e.target.getAttribute("status"),
          filterStatus = e.target.getAttribute("filterstatus");
      var statusState = void 0;
      if (status == "complete") {
        statusState = "showCompleted";
      } else if (status == "withdrawn") {
        statusState = "showWithdrawn";
      } else if (status == "upcoming") {
        if (filterStatus == 1) {
          statusState = "showHandleitUpcoming";
        } else {
          statusState = "showProjectUpcoming";
        }
      } else {
        if (filterStatus == 1) {
          statusState = "showHandleitInProgress";
        } else {
          statusState = "showProjectInProgress";
        }
      }
      _this.setState(function (state) {
        return _defineProperty({}, statusState, !state[statusState]);
      });
    };

    _this.onChangeCompleteYear = function (e) {
      console.log(e.target.value);
      _this.setState({
        selectedCompleteYear: e.target.value
      });
    };

    _this.createProjectTable = function (title, status, filterStatus) {
      var projectRows = _this.createProjectRows(status, filterStatus);

      // Determine if state status on whether table should be shown
      var showStatus = void 0;
      if (status == "upcoming") {
        if (filterStatus == 1) {
          showStatus = _this.state.showHandleitUpcoming;
        } else {
          showStatus = _this.state.showProjectUpcoming;
        }
      } else if (status == "in_progress") {
        if (filterStatus == 1) {
          showStatus = _this.state.showHandleitInProgress;
        } else {
          showStatus = _this.state.showProjectInProgress;
        }
      } else if (status == "complete") {
        showStatus = _this.state.showCompleted;
      } else {
        showStatus = _this.state.showWithdrawn;
      }

      // show column only when both handleit & projects are showng
      var handleitColumn = filterStatus == 0 ? React.createElement(
        "th",
        { className: "col-sm-1", scope: "col" },
        "Handle-It"
      ) : null;
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            React.createElement(
              "a",
              { href: "#", status: status, filterstatus: filterStatus,
                onClick: _this.onClickProjectHeader },
              title
            )
          ),
          status == "complete" ? React.createElement(
            "select",
            { value: _this.state.selectedCompleteYear,
              onChange: _this.onChangeCompleteYear },
            React.createElement(
              "option",
              { value: "all" },
              "All"
            ),
            _this.state.completeYears.map(function (year) {
              return React.createElement(
                "option",
                { key: year, value: year },
                year
              );
            })
          ) : null
        ),
        showStatus ? React.createElement(
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
                { className: "col-sm-2", scope: "col" },
                "Project Name"
              ),
              handleitColumn,
              React.createElement(
                "th",
                { className: "col-sm-2", scope: "col" },
                "Applicant"
              ),
              React.createElement(
                "th",
                { className: "col-sm-2", scope: "col" },
                "Location"
              ),
              React.createElement(
                "th",
                { className: "col-sm-2", scope: "col" },
                "Start Date"
              ),
              React.createElement(
                "th",
                { className: "col-sm-1", scope: "col" },
                "CC"
              ),
              React.createElement(
                "th",
                { className: "col-sm-1", scope: "col" },
                "PA"
              ),
              React.createElement(
                "th",
                { className: "col-sm-1", scope: "col" },
                "SH"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            projectRows
          )
        ) : null
      );
    };

    _this.state = {
      projects: [],
      showHandleitUpcoming: true,
      showHandleitInProgress: true,
      showProjectUpcoming: true,
      showProjectInProgress: true,
      showCompleted: true,
      showWithdrawn: true,
      selectedCompleteYear: "all",
      completeYears: [] // Contains years of completed projects
    };
    _this.get_projects();
    return _this;
  }

  /**
   * Create Project TR element
   * @param {*} status-projet.status[String]
   * @param {*} filterStatus 0 to not filter, 1 to filter out non-handleit, 
   *  2 to filter out handleit
   */


  /**
   * Create Table for projects
   * @param {*} status-projet.status[String]
   * @param {*} filterStatus 0 to not filter, 1 to filter out non-handleit, 
   *  2 to filter out handleit
   */


  _createClass(AppProjects, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h2",
          null,
          "Projects"
        ),
        this.createProjectTable("Handle-It: Upcoming", "upcoming", 1),
        this.createProjectTable("Handle-It: In Progress", "in_progress", 1),
        this.createProjectTable("Project: Upcoming", "upcoming", 2),
        this.createProjectTable("Project: In Progress", "in_progress", 2),
        this.createProjectTable("Completed", "complete", 0),
        this.createProjectTable("Withdrawn", "withdrawn", 0)
      );
    }
  }]);

  return AppProjects;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(AppProjects, null), document.getElementById("projects_container"));
}

loadReact();