var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { ProjectMenu } from "../components/project/projectmenu.js";
import { ApplicationInformation } from "../ApplicationInformation.js";
import { ModalMenu } from "../modalmenu.js";

var ProjectApp = function (_React$Component) {
  _inherits(ProjectApp, _React$Component);

  function ProjectApp(props) {
    _classCallCheck(this, ProjectApp);

    var _this = _possibleConstructorReturn(this, (ProjectApp.__proto__ || Object.getPrototypeOf(ProjectApp)).call(this, props));

    _this.set_create_workitem_menu = function () {
      var data = {
        project_id: _this.state.project._id,
        type: "project",
        application_id: _this.state.application.id
      };
      _this.modalmenu.current.show_menu("create_workitem", funkie.create_workitem, data, _this.project_menu.current.add_workitem);
    };

    _this.set_create_partner_menu = function (data, submit_handler, data_callback) {
      _this.modalmenu.current.show_menu("create_partner", submit_handler, data, data_callback);
    };

    _this.set_edit_partner_menu = function (data, submit_handler, data_callback) {
      _this.modalmenu.current.show_menu("edit_partner", submit_handler, data, data_callback);
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
      project: null,
      application: null
    };
    _this.load_project();
    _this.project_menu = React.createRef();
    _this.modalmenu = React.createRef();
    return _this;
  }

  _createClass(ProjectApp, [{
    key: "load_project",
    value: function load_project() {
      if (project_id) {
        $.ajax({
          url: "/app_project/projects/" + project_id,
          type: "GET",
          context: this,
          success: function success(project_data) {
            var _this2 = this;

            console.log(project_data);
            // this.project_menu.current.load_project(project_data);
            this.setState({
              project: project_data
            }, function () {
              _this2.load_application_data(project_data.documentPackage);
            });
          }
        });
      }
    }
  }, {
    key: "load_application_data",
    value: function load_application_data(documentPackage_id) {
      $.ajax({
        url: "/app_project/application/" + documentPackage_id,
        type: "GET",
        context: this,
        success: function success(app_data) {
          console.log(app_data);
          this.setState({ application: app_data });
        }
      });
    }

    // materialsitem_handler handles showing the element

  }, {
    key: "render",
    value: function render() {
      var assessment_id;
      if (this.state.project) {
        assessment_id = this.state.project.siteAssessment;
      }
      return React.createElement(
        "div",
        null,
        this.state.project ? React.createElement(ProjectMenu, { ref: this.project_menu,
          set_create_workitem_menu: this.set_create_workitem_menu,
          set_create_materialsitem_menu: this.set_create_materialsitem_menu,
          set_edit_materialisitem_menu: this.set_edit_materialisitem_menu,
          set_edit_workitem_menu: this.set_edit_workitem_menu,
          set_create_partner_menu: this.set_create_partner_menu,
          set_edit_partner_menu: this.set_edit_partner_menu,
          project_data: this.state.project
        }) : React.createElement("div", null),
        this.state.application ? React.createElement(ApplicationInformation, {
          project_id: project_id,
          application: this.state.application,
          view_type: "project", assessment_id: assessment_id
        }) : React.createElement("div", null),
        React.createElement(ModalMenu, { ref: this.modalmenu })
      );
    }
  }]);

  return ProjectApp;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(ProjectApp, null), document.getElementById("project_container"));
}

loadReact();