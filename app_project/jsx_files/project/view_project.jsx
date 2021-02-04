import { ProjectMenu } from "../components/project/projectmenu.js"

class ProjectApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
      application: null,
    };
    this.load_project();
    this.project_menu = React.createRef();
    this.modalmenu = React.createRef();
  }

  load_project() {
    if (project_id) {
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        context: this,
        success: function(project_data) {
          console.log(project_data);
          this.project_menu.current.load_project(project_data);
          this.setState({
            project: project_data,
          }, () => {
            this.load_application_data(project_data.documentPackage);
          });
        }
      });
    }
  }

  load_application_data(documentPackage_id) {
    $.ajax({
      url: "/app_project/application/" + documentPackage_id,
      type: "GET",
      context: this,
      success: function(app_data) {
        console.log(app_data);
        this.setState({application: app_data});
      }
    })
  }

  set_create_workitem_menu = () => {
    var data = {
      project_id: this.state.project._id,
      type: "project",
      application_id: this.state.application.id,
    };
    this.modalmenu.current.show_menu(
      "create_workitem",
      funkie.create_workitem,
      data,
      this.project_menu.current.add_workitem,
    )
  }

  set_create_partner_menu = (data, submit_handler, data_callback) => {
    this.modalmenu.current.show_menu(
      "create_partner",
      submit_handler,
      data,
      data_callback,
    );
  };
  set_edit_partner_menu = (data, submit_handler, data_callback) => {
    this.modalmenu.current.show_menu(
      "edit_partner",
      submit_handler,
      data,
      data_callback,
    );
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
      edit_workitem_handler
    );
  };

  render() {
    var assessment_id;
    if (this.state.project) {
      assessment_id = this.state.project.siteAssessment;
    }
    return (
    <div>
      <ProjectMenu ref={this.project_menu} 
        set_create_workitem_menu={this.set_create_workitem_menu}
        set_create_materialsitem_menu={this.set_create_materialsitem_menu}
        set_edit_materialisitem_menu = {this.set_edit_materialisitem_menu}
        set_edit_workitem_menu = {this.set_edit_workitem_menu}
        set_create_partner_menu = {this.set_create_partner_menu}
        set_edit_partner_menu = {this.set_edit_partner_menu}
      />
      <ApplicationInformation
        project_id={project_id}
        application={this.state.application}
        view_type="project" assessment_id={assessment_id}
      />
      <ModalMenu ref={this.modalmenu} />
    </div>);
  }
}



function loadReact() {
  ReactDOM.render(<ProjectApp />, document.getElementById("project_container"));
}

loadReact();