var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
        success: function success(data) {
          console.log(data);
          that.setState({ projects: data });
        }
      });
    };

    _this.createProjectRows = function (status, filterStatus) {
      var projects = [];
      var project = void 0,
          start = void 0,
          doc = void 0,
          app = void 0,
          address = void 0,
          handleitColumn = void 0;

      for (var i = 0; i < _this.state.projects.length; i++) {
        project = _this.state.projects[i];
        if (project.status != status) continue;
        if (filterStatus == 2 && project.handleit || filterStatus == 1 && !project.handleit) {
          continue;
        }
        if (project.start) start = project.start.replace("T", " ").substring(0, project.start.length - 8);
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
            start
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
      return projects;
    };

    _this.createProjectTable = function (title, status, filterStatus) {
      var projectRows = _this.createProjectRows(status, filterStatus);
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
          "h2",
          null,
          title
        ),
        React.createElement(
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
        )
      );
    };

    _this.state = {
      projects: []
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