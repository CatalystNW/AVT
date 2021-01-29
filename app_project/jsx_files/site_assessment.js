class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // both apps and assessments should be length 1, but use map to create them
      application: null,
      assessment: {},
    }
    this.getAppData();
    this.getAssessment();
    
    this.modalmenu = React.createRef();
    this.assessmentmenu = React.createRef();
    this.applicationinfo = React.createRef();
  }

  getAppData = () => {
    var that = this;
    funkie.load_application(app_id, function(data) {
      console.log(data);
      that.setState({application: data});
    });
  };

  getAssessment = () => {
    var that = this;
    funkie.get_assessment_by_appId(
      app_id, 
      (data) => {
        console.log(data.site_assessment);
        that.assessmentmenu.current.change_assessment(data.site_assessment);
        that.setState({assessment: data.site_assessment,});
      },
    );
  };

  set_create_workitem_menu =() => {
    var data = {
      assessment_id: this.state.assessment._id, 
      type: "assessment",
      application_id: app_id,
    };
    this.modalmenu.current.show_menu(
      "create_workitem", 
      funkie.create_workitem, 
      data,
      this.assessmentmenu.current.add_workitem,
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
    var vetting_summary;
    if (this.state.application !== null) {
      vetting_summary = this.state.application.vetting_summary
    }
    return (
      <div className="row">
        <AssessmentMenu 
          ref={this.assessmentmenu}
          assessment={{}}
          vetting_summary = {vetting_summary}
          application_id={app_id}
          set_create_workitem_menu={this.set_create_workitem_menu}
          set_create_materialsitem_menu={this.set_create_materialsitem_menu}
          set_edit_materialisitem_menu = {this.set_edit_materialisitem_menu}
          set_edit_workitem_menu = {this.set_edit_workitem_menu}
        />
        <ApplicationInformation
          application={this.state.application} 
        />

        <ModalMenu ref={this.modalmenu} />
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<App />, document.getElementById("site_assessment_container"));
}

loadReact();