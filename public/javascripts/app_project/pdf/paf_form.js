var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PAFApp = function (_React$Component) {
  _inherits(PAFApp, _React$Component);

  function PAFApp(props) {
    _classCallCheck(this, PAFApp);

    var _this = _possibleConstructorReturn(this, (PAFApp.__proto__ || Object.getPrototypeOf(PAFApp)).call(this, props));

    _this.getProject = function () {
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        success: function success(data) {
          console.log(data);
        }
      });
    };

    _this.getProject();
    return _this;
  }

  _createClass(PAFApp, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        project_id
      );
    }
  }]);

  return PAFApp;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(PAFApp, null), document.getElementById("pdf_container"));
}

loadReact();