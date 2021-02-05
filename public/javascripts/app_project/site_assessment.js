var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { AssessmentMenu } from "./AssessmentMenu.js";
import { ApplicationInformation } from "./ApplicationInformation.js";

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.getAppData = function () {
      var that = _this;
      funkie.load_application(app_id, function (data) {
        console.log(data);
        that.setState({ application: data });
      });
    };

    _this.getAssessment = function () {
      var that = _this;
      funkie.get_assessment_by_appId(app_id, function (data) {
        console.log(data.site_assessment);
        that.assessmentmenu.current.change_assessment(data.site_assessment);
        that.setState({ assessment: data.site_assessment });
      });
    };

    _this.set_create_workitem_menu = function () {
      var data = {
        assessment_id: _this.state.assessment._id,
        type: "assessment",
        application_id: app_id
      };
      _this.modalmenu.current.show_menu("create_workitem", funkie.create_workitem, data, _this.assessmentmenu.current.add_workitem);
    };

    _this.set_edit_materialisitem_menu = function (old_data, edit_materialsitem_handler) {
      _this.modalmenu.current.show_menu("edit_materialsitem", funkie.edit_materialsitem, old_data, edit_materialsitem_handler // <WorkItem> method
      );
    };

    _this.set_create_materialsitem_menu = function (e, materialsitem_handler) {
      var data = {
        workitem_id: e.target.getAttribute("workitem_id")
      };
      _this.modalmenu.current.show_menu("create_materialsitem", funkie.create_materialsitem, data, materialsitem_handler);
    };

    _this.set_edit_workitem_menu = function (data, edit_workitem_handler) {
      _this.modalmenu.current.show_menu("edit_workitem", funkie.edit_workitem, data, edit_workitem_handler);
    };

    _this.state = {
      // both apps and assessments should be length 1, but use map to create them
      application: null,
      assessment: {}
    };
    _this.getAppData();
    _this.getAssessment();

    _this.modalmenu = React.createRef();
    _this.assessmentmenu = React.createRef();
    _this.applicationinfo = React.createRef();
    return _this;
  }

  // materialsitem_handler handles showing the element


  _createClass(App, [{
    key: "render",
    value: function render() {
      var vetting_summary;
      if (this.state.application !== null) {
        vetting_summary = this.state.application.vetting_summary;
      }
      return React.createElement(
        "div",
        { className: "row" },
        React.createElement(AssessmentMenu, {
          ref: this.assessmentmenu,
          assessment: {},
          vetting_summary: vetting_summary,
          application_id: app_id,
          set_create_workitem_menu: this.set_create_workitem_menu,
          set_create_materialsitem_menu: this.set_create_materialsitem_menu,
          set_edit_materialisitem_menu: this.set_edit_materialisitem_menu,
          set_edit_workitem_menu: this.set_edit_workitem_menu
        }),
        React.createElement(ApplicationInformation, {
          application: this.state.application
        }),
        React.createElement(ModalMenu, { ref: this.modalmenu })
      );
    }
  }]);

  return App;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(App, null), document.getElementById("site_assessment_container"));
}

loadReact();