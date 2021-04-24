var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { ApplicationReport };

var ApplicationReport = function (_React$Component) {
  _inherits(ApplicationReport, _React$Component);

  function ApplicationReport() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ApplicationReport);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ApplicationReport.__proto__ || Object.getPrototypeOf(ApplicationReport)).call.apply(_ref, [this].concat(args))), _this), _this.searchForm = function (e) {
      e.preventDefault();
    }, _temp), _possibleConstructorReturn(_this, _ret);
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
        )
      );
    }
  }]);

  return ApplicationReport;
}(React.Component);