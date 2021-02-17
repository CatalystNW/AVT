var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteManagerApp = function (_React$Component) {
  _inherits(DeleteManagerApp, _React$Component);

  function DeleteManagerApp() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DeleteManagerApp);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DeleteManagerApp.__proto__ || Object.getPrototypeOf(DeleteManagerApp)).call.apply(_ref, [this].concat(args))), _this), _this.onClick_delAssessments = function () {
      var result = window.confirm("Are you sure you want to delete all assessments?");
      if (result) {
        $.ajax({
          type: "DELETE",
          url: "./delete_manager?command=delete_all_assessments",
          success: function success(data, textStatus, xhr) {
            window.alert("done");
          }
        });
      }
    }, _this.onClick_delete_all_projects = function () {
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
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DeleteManagerApp, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          null,
          React.createElement(
            "button",
            { className: "btn btn-primary", onClick: this.onClick_delAssessments,
              id: "del-assessments-but" },
            "Delete"
          ),
          " All Site Assessments, Work Items, Materials List"
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "button",
            { type: "button", onClick: this.onClick_delete_all_projects },
            "Delete Projects, Plan Wrapup checlists"
          )
        )
      );
    }
  }]);

  return DeleteManagerApp;
}(React.Component);

(function loadReact() {
  ReactDOM.render(React.createElement(DeleteManagerApp, null), document.getElementById("content-container"));
})();