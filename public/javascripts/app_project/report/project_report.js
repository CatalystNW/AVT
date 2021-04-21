var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { ProjectReport };

var ProjectReport = function (_React$Component) {
  _inherits(ProjectReport, _React$Component);

  function ProjectReport(props) {
    _classCallCheck(this, ProjectReport);

    var _this = _possibleConstructorReturn(this, (ProjectReport.__proto__ || Object.getPrototypeOf(ProjectReport)).call(this, props));

    _this.get_data = function () {
      var data = {};
      var formData = new FormData($("#" + _this.formId)[0]);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = formData.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          data[key] = formData.get(key);
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

      return data;
    };

    _this.searchForm = function (e) {
      e.preventDefault();
      _this.get_data();
      $.ajax({
        url: "/app_project/report/project",
        type: "POST",
        data: _this.get_data(),
        context: _this,
        success: function success(projects) {
          console.log(projects);
        }

      });
    };

    _this.formId = "project-form";
    return _this;
  }

  _createClass(ProjectReport, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $(".datepicker").datepicker({
        orientation: 'bottom',
        format: 'yyyy-mm-dd'
      });
    }
  }, {
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
            "Start Date"
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
        )
      );
    }
  }]);

  return ProjectReport;
}(React.Component);