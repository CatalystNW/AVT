var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectsTransferApp = function (_React$Component) {
  _inherits(ProjectsTransferApp, _React$Component);

  function ProjectsTransferApp(props) {
    _classCallCheck(this, ProjectsTransferApp);

    var _this = _possibleConstructorReturn(this, (ProjectsTransferApp.__proto__ || Object.getPrototypeOf(ProjectsTransferApp)).call(this, props));

    _this.getAssessments = function () {
      $.ajax({
        url: "/app_project/site_assessments/to_transfer",
        type: "GET",
        context: _this,
        success: function success(assessments) {
          console.log(assessments);
          this.setState({
            assessments: assessments
          });
        }
      });
    };

    _this.getAssessments();
    _this.state = {
      assessments: []
    };
    return _this;
  }

  _createClass(ProjectsTransferApp, [{
    key: "render",
    value: function render() {
      var doc = void 0,
          app = void 0,
          address = void 0,
          numWorkitems = void 0;
      return React.createElement(
        "div",
        null,
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
                { scope: "col" },
                "Name"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Address"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "# Work Items"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            this.state.assessments.map(function (assessment) {
              doc = assessment.documentPackage;
              app = doc.application;
              address = app.address.line_2 ? app.address.line_1 + " " + app.address.line_2 : app.address.line_1;
              // count # of accepted work items
              numWorkitems = 0;
              assessment.workItems.forEach(function (workItem) {
                if (workItem.status == "accepted") {
                  numWorkitems++;
                }
              });

              return React.createElement(
                "tr",
                { key: assessment._id },
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "a",
                    { href: "/app_project/project_transfer/" + assessment._id },
                    app.name.first,
                    " ",
                    app.name.last
                  )
                ),
                React.createElement(
                  "td",
                  null,
                  address
                ),
                React.createElement(
                  "td",
                  null,
                  numWorkitems
                )
              );
            })
          )
        )
      );
    }
  }]);

  return ProjectsTransferApp;
}(React.Component);

(function loadReact() {
  ReactDOM.render(React.createElement(ProjectsTransferApp, null), document.getElementById("transfer-container"));
})();