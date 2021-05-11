var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { PartnersReport };

import { functionHelper } from "../functionHelper.js";

var PartnersReport = function (_React$Component) {
  _inherits(PartnersReport, _React$Component);

  function PartnersReport(props) {
    _classCallCheck(this, PartnersReport);

    var _this = _possibleConstructorReturn(this, (PartnersReport.__proto__ || Object.getPrototypeOf(PartnersReport)).call(this, props));

    _this.getPartners = function () {
      $.ajax({
        url: "/app_project/report/partners",
        type: "GET",
        context: _this,
        success: function success(data) {
          var partnersDict = {};
          var partnersData = data.partners,
              projectsData = data.projects;
          var i = void 0;
          for (i = 0; i < partnersData.length; i++) {
            partnersDict[partnersData[i]._id] = partnersData[i];
            partnersDict[partnersData[i]._id].projects = [];
          }

          for (i = 0; i < projectsData.length; i++) {
            projectsData[i].partners.forEach(function (partner) {
              if (partner in partnersDict) {
                partnersDict[partner].push(projectsData[i]);
              }
            });
          }
          this.setState({
            partners: Object.entries(partnersDict)
          });
        }
      });
    };

    _this.createPartnersTable = function () {
      return React.createElement(
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
            )
          )
        ),
        React.createElement("tbody", null)
      );
    };

    _this.state = {
      partners: []

    };
    _this.getPartners();
    return _this;
  }

  _createClass(PartnersReport, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.createPartnersTable()
      );
    }
  }]);

  return PartnersReport;
}(React.Component);