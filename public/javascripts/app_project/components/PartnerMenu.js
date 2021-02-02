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

    _this.loadAllPartners = function () {
      $.ajax({
        url: "/app_project/partners",
        type: "GET",
        context: _this,
        success: function success(partnersData) {
          this.setState({
            allPartners: partnersData
          });
        }
      });
    };

    _this.change_status = function () {
      var new_status = _this.state.status == "show_current_partners" ? "show_all_partners" : "show_current_partners";
      if (new_status == "show_all_partners") {
        _this.loadAllPartners();
      }
      _this.setState({
        status: new_status
      });
    };

    _this.show_current_partners = function () {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button", className: "btn btn-sm",
            onClick: _this.change_status },
          "Add Partner"
        ),
        React.createElement(
          "h3",
          null,
          "Current Partners"
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
            _this.state.partners.map(function (partner, index) {
              return React.createElement(
                "tr",
                { key: "current-" + partner._id },
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
    };

    _this.show_all_partners = function () {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button", className: "btn btn-sm",
            onClick: _this.change_status },
          "Submit"
        ),
        React.createElement(
          "h3",
          null,
          "Available Partners"
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
            _this.state.allPartners.map(function (partner, index) {
              return React.createElement(
                "tr",
                { key: "all-" + partner._id },
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
    };

    _this.state = {
      partners: [],
      allPartners: [],
      status: "show_current_partners"
    };
    return _this;
  }

  _createClass(PartnerMenu, [{
    key: "render",
    value: function render() {
      if (this.state.status == "show_all_partners") {
        return this.show_all_partners();
      } else {
        return this.show_current_partners();
      }
    }
  }]);

  return PartnerMenu;
}(React.Component);