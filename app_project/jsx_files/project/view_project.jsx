import { ProjectMenu } from "./projectmenu.js"
import { ApplicationInformation } from "../ApplicationInformation.js"
import { ModalMenu } from "../modalmenu.js"

class ProjectApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      application: null,
    };
    this.loadProjectAndApplication();
    this.project_menu = React.createRef();
    this.modalmenu = React.createRef();
  }

  loadProjectAndApplication() {
    this.load_project(this.load_application_data);
  }

  // Loads project data, sets state to the data, and then runs callback
  load_project = (callback) => {
    if (project_id) {
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        context: this,
        success: function(project_data) {
          console.log(project_data);
          this.setState({
            project: project_data,
          }, () => {
            if (callback)
              callback();
          });
        }
      });
    }
  };

  load_application_data = () => {
    $.ajax({
      url: "/app_project/application/" + this.state.project.documentPackage._id,
      type: "GET",
      context: this,
      success: function(app_data) {
        console.log("app", app_data);
        this.setState({application: app_data});
      }
    });
  };

  set_create_workitem_menu = () => {
    var data = {
      project_id: this.state.project._id,
      type: "project",
    };
    this.modalmenu.current.show_menu(
      "create_workitem",
      funkie.create_workitem,
      data,
      this.project_menu.current.add_workitem,
      "project"
    )
  };

  set_edit_materialisitem_menu = (old_data, edit_materialsitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_materialsitem",
      funkie.edit_materialsitem,
      old_data,
      edit_materialsitem_handler, // <WorkItem> method
    );
  };

  // materialsitem_handler handles showing the element
  set_create_materialsitem_menu = (e, materialsitem_handler) => {
    var data = {
      workitem_id: e.target.getAttribute("workitem_id")
    }
    this.modalmenu.current.show_menu(
      "create_materialsitem",
      funkie.create_materialsitem,
      data,
      materialsitem_handler,
    );
  };

  set_edit_workitem_menu = (data, edit_workitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_workitem",
      funkie.edit_workitem,
      data,
      edit_workitem_handler,
      "project"
    );
  };

  getModalMenu = () => {
    return this.modalmenu.current;
  }

  render() {
    var assessment_id;
    if (this.state.project && !this.state.project.handleit) {
      assessment_id = this.state.project.siteAssessment._id;
    } else {
      assessment_id = null;
    }
    return (
    <div>
      <ModalMenu ref={this.modalmenu} />

      { this.state.project ? 
        (<ProjectMenu ref={this.project_menu} 
          set_create_workitem_menu={this.set_create_workitem_menu}
          set_create_materialsitem_menu={this.set_create_materialsitem_menu}
          set_edit_materialisitem_menu = {this.set_edit_materialisitem_menu}
          set_edit_workitem_menu = {this.set_edit_workitem_menu}
          getModalMenu={this.getModalMenu}
          project_data={this.state.project}
        />) : (<div></div>)}

      { this.state.application ? (
      <ApplicationInformation
        project_id={project_id}
        application={this.state.application}
        view_type="project" assessment_id={assessment_id}
      />) : (<div></div>)}
    </div>);
  }
}

function loadReact() {
  ReactDOM.render(<ProjectApp />, document.getElementById("project_container"));
}

loadReact();

window.onresize = function() {
  const height = funkie.calculate_page_height().toString() + "px";
  // Set Application Info Container
  const appInfo = document.getElementById("application-info-container"),
        project_menu = document.getElementById("assessment-container");
  appInfo.style.height = height;
  project_menu.style.height = height;
}