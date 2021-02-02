var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartnerMenu = function (_React$Component) {
  _inherits(PartnerMenu, _React$Component);

  function PartnerMenu(props) {
    _classCallCheck(this, PartnerMenu);

    var _this = _possibleConstructorReturn(this, (PartnerMenu.__proto__ || Object.getPrototypeOf(PartnerMenu)).call(this, props));

    _this.loadPartners = function () {};

    _this.loadAllPartners = function () {};

    _this.state = {
      partners: []
    };
    return _this;
  }

  _createClass(PartnerMenu, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button", className: "btn btn-sm" },
          "Add Partner"
        ),
        React.createElement(
          "h3",
          null,
          "Partners"
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
                "ID"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            this.state.partners.map(function (partner, index) {
              return React.createElement(
                "tr",
                null,
                React.createElement(
                  "td",
                  null,
                  partner._id
                )
              );
            })
          )
        )
      );
    }
  }]);

  return PartnerMenu;
}(React.Component);