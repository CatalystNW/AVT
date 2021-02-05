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

    _this.onClick_delete_all_projects = function () {
      var result = window.confirm("Are you sure you want to delete all projects?");
      if (result) {
        $.ajax({
          url: "./projects",
          type: "DELETE",
          success: function success(data) {
            window.alert("All the projects were deleted");
          }
        });
      }
    };

    _this.state = {
      projects: []
    };
    _this.get_projects();
    return _this;
  }

  _createClass(AppProjects, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button", onClick: this.onClick_delete_all_projects },
          "Delete Projects"
        ),
        React.createElement(
          "table",
          null,
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
                "Status"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Description"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "# Work Items"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Link"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            this.state.projects.map(function (project) {
              return React.createElement(
                "tr",
                { key: project._id },
                React.createElement(
                  "td",
                  null,
                  project.name
                ),
                React.createElement(
                  "td",
                  null,
                  project.status
                ),
                React.createElement(
                  "td",
                  null,
                  project.description
                ),
                React.createElement(
                  "td",
                  null,
                  project.workItems.length
                ),
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "a",
                    { href: "./view_projects/" + project._id },
                    project._id
                  )
                )
              );
            })
          )
        )
      );
    }
  }]);

  return AppProjects;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(AppProjects, null), document.getElementById("projects_container"));
}

loadReact();