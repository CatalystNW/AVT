class AssessmentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workItems: [],
    }
    this.checklist = React.createRef();
  }

  change_assessment = (assessment) => {
    this.setState(assessment);
    this.checklist.current.load_assessment(assessment);
  };

  add_workitem = (workitem) => {
    this.setState({
      workItems: [workitem, ...this.state.workItems],
    });
  };

  render() {
    const divStyle = {
      height: funkie.calculate_page_height().toString() + "px",
    };

    return (
      <div className="col-sm-12 col-lg-8 overflow-auto" style={divStyle}
        id="assessment-container" key={this.state._id}>
          <ul className="nav nav-tabs" id="nav-assessment-tabs" role="tablist">
            <a className="nav-item nav-link active" id="nav-checklist-tab" data-toggle="tab" 
                href="#nav-checklist" role="tab">Checklist</a>
            <a className="nav-item nav-link" id="nav-property-tab" data-toggle="tab" 
                href="#nav-workitem" role="tab">Work Items</a>
          </ul>

          <div className="tab-content" id="nav-assessment-tabContent">
            <div className="tab-pane show active" id="nav-checklist" role="tabpanel">
              <AssessmentChecklist ref={this.checklist}
                assessment={{}}
                set_create_tools_menu = {this.props.set_create_tools_menu}
              />
            </div>
            <div className="tab-pane" id="nav-workitem" role="tabpanel">
              <button type="button" className="btn btn-primary" 
                onClick={this.props.set_create_workitem_menu}>
                Create Work Item
              </button>
              {this.state.workItems.map((workitem) => {
                return (
                <WorkItem 
                  workitem={workitem}
                  set_edit_materialisitem_menu={this.props.set_edit_materialisitem_menu}
                  set_create_materialsitem_menu={this.props.set_create_materialsitem_menu}
                  key={workitem._id+"-workitem-card"}></WorkItem>);
              })}
            </div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      // both apps and assessments should be length 1, but use map to create them
      applications: [],
      assessment: {},
    }
    this.getAppData();
    this.getAssessment();
    
    this.modalmenu = React.createRef();
    this.assessmentmenu = React.createRef();
  }

  getAppData = () => {
    var that = this;
    funkie.load_application(app_id, function(data) {
      that.setState({applications: [data,]});
    });
  }

  getAssessment = () => {
    var that = this;
    funkie.get_assessment(app_id, function(data) {
      console.log(data.site_assessment);
      that.assessmentmenu.current.change_assessment(data.site_assessment);
      that.setState({assessment: data.site_assessment,});
    });
  }

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
  }

  set_edit_materialisitem_menu = (old_data, edit_item_handler) => {
    this.modalmenu.current.show_menu(
      "edit_materialsitem",
      funkie.edit_materialsitem,
      old_data,
      edit_item_handler, // <WorkItem> method
    );
  }

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
  }

  set_create_tools_menu = () => {
    var data = {
      assessment_id: this.state.assessment._id, 
    };
    this.modalmenu.current.show_menu(
      "create_tools",
      funkie.create_tool,
      data,
      );
  }

  render() {
    const application_information = this.state.applications.map((application) => {
      return <ApplicationInformation key={application.id} 
        application={application}></ApplicationInformation>
    });

    return (
      <div>
        <AssessmentMenu 
          ref={this.assessmentmenu}
          assessment={{}}
          application_id={app_id} 
          set_create_workitem_menu={this.set_create_workitem_menu}
          set_create_materialsitem_menu={this.set_create_materialsitem_menu}
          set_edit_materialisitem_menu = {this.set_edit_materialisitem_menu}
          set_create_tools_menu = {this.set_create_tools_menu}
        />
        {application_information}

        <ModalMenu ref={this.modalmenu} />
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<App />, document.getElementById("site_assessment_container"));
}

loadReact();