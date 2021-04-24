var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { SearchReport };

import { functionHelper } from "./functionHelper.js";

var SearchReport = function (_React$Component) {
  _inherits(SearchReport, _React$Component);

  function SearchReport(props) {
    _classCallCheck(this, SearchReport);

    var _this = _possibleConstructorReturn(this, (SearchReport.__proto__ || Object.getPrototypeOf(SearchReport)).call(this, props));

    _this.searchForm = function (e) {
      e.preventDefault();
      console.log(functionHelper.get_data(_this.searchFormId));
      $.ajax({
        url: "/app_project/report/search_applications",
        type: "POST",
        data: functionHelper.get_data(_this.searchFormId),
        context: _this,
        success: function success(applications) {
          console.log(applications);
        }
      });
    };

    _this.createForm = function () {
      return React.createElement(
        "form",
        { id: _this.searchFormId, onSubmit: _this.searchForm },
        React.createElement(
          "h3",
          null,
          "Application Info"
        ),
        React.createElement(
          "div",
          { className: "form-row" },
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "First Name"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "first_name" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Last Name"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "last_name" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "City"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "city" })
          ),
          React.createElement(
            "div",
            { className: "form-group col-sm-6 col-md-3" },
            React.createElement(
              "label",
              null,
              "Zip Code"
            ),
            React.createElement("input", { className: "form-control", type: "text", name: "zip" })
          )
        ),
        React.createElement(
          "button",
          { type: "submit" },
          "Submit"
        )
      );
    };

    _this.searchFormId = "search-applications-form";
    return _this;
  }

  _createClass(SearchReport, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.createForm()
      );
    }
  }]);

  return SearchReport;
}(React.Component);