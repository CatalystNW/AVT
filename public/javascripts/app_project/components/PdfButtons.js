var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { PdfButtons };

var PdfButtons = function (_React$Component) {
  _inherits(PdfButtons, _React$Component);

  function PdfButtons(props) {
    _classCallCheck(this, PdfButtons);

    var _this = _possibleConstructorReturn(this, (PdfButtons.__proto__ || Object.getPrototypeOf(PdfButtons)).call(this, props));

    _this.onClick_PAF = function () {
      if (_this.props.type == "project") {
        var project_id = _this.props.project_id;
        window.open("/app_project/projects/paf_form/" + project_id);
      } else if (_this.props.type == "assessment") {
        var assessment_id = _this.props.assessment_id;
        window.open("/app_project/project_id/paf_form/" + assessment_id);
      }
    };

    _this.onClick_handleitForm = function () {
      if (_this.props.type == "project") {
        var project_id = _this.props.project_id;
        window.open("/app_project/projects/handleit_form/" + project_id);
      } else if (_this.props.type == "assessment") {
        var assessment_id = _this.props.assessment_id;
        window.open("/app_project/view_site_assessments/paf_form/" + assessment_id);
      }
    };

    return _this;
  }

  _createClass(PdfButtons, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button",
            onClick: this.onClick_PAF },
          "PAF Report"
        ),
        React.createElement(
          "button",
          { type: "button",
            onClick: this.onClick_handleitForm },
          "Handle-It Report"
        )
      );
    }
  }]);

  return PdfButtons;
}(React.Component);