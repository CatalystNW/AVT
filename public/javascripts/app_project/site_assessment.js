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

  componentDidMount() {
    // Tab changed. Newer versions of Bootstrap has a slight change in this
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
      console.log(e.target);
      console.log(e.relatedTarget);
    })
    
  }

  add_workitem = (workitem) => {
    this.setState({
      workItems: [workitem, ...this.state.workItems],
    });
  };
  remove_workitem = (workitem_id) => {
    // I'm not sure if the workitems themselves should be copied
    // But this is appending the original workitems to a new list
    var new_workitems = [];
    for(var i=0; i< this.state.workItems.length; i++) {
      if (this.state.workItems[i]._id != workitem_id) {
        new_workitems.push(this.state.workItems[i]);
      }
    }
    this.setState({
      workItems: new_workitems,
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
            <li className="nav-item">
              <a className="nav-link active" id="nav-checklist-tab" data-toggle="tab" 
                href="#nav-checklist" role="tab">Checklist</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-property-tab" data-toggle="tab" 
                href="#nav-workitem" role="tab">Work Items</a>
            </li>
          </ul>

          <div className="tab-content" id="nav-assessment-tabContent">
            <div className="tab-pane show active" id="nav-checklist" role="tabpanel">
              <AssessmentChecklist ref={this.checklist}
                assessment={{}}
                set_create_costsitem_menu = {this.props.set_create_costsitem_menu}
                set_edit_costsitem_menu = {this.props.set_edit_costsitem_menu}
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
                  remove_workitem={this.remove_workitem}
                  set_edit_materialisitem_menu={this.props.set_edit_materialisitem_menu}
                  set_create_materialsitem_menu={this.props.set_create_materialsitem_menu}
                  set_edit_workitem_menu = {this.props.set_edit_workitem_menu}
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
      that.setState({application: data});
    });
  };

  getAssessment = () => {
    var that = this;
    funkie.get_assessment(app_id, function(data) {
      console.log(data.site_assessment);
      that.assessmentmenu.current.change_assessment(data.site_assessment);
      that.setState({assessment: data.site_assessment,});
    });
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

  set_create_costsitem_menu = (add_element_handler) => {
    var data = {
      assessment_id: this.state.assessment._id, 
    };
    this.modalmenu.current.show_menu(
      "create_costsitem",
      funkie.create_costsitem,
      data,
      add_element_handler,
    );
  };

  set_edit_costsitem_menu  = (old_data, edit_costsitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_costsitem",
      funkie.edit_costsitem,
      old_data,
      edit_costsitem_handler,
    );
  };

  set_edit_workitem_menu = (data, edit_workitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_workitem",
      funkie.edit_workitem,
      data,
      edit_workitem_handler
    );
  }

  render() {
    return (
      <div>
        <AssessmentMenu 
          ref={this.assessmentmenu}
          assessment={{}}
          application_id={app_id} 
          set_create_workitem_menu={this.set_create_workitem_menu}
          set_create_materialsitem_menu={this.set_create_materialsitem_menu}
          set_edit_materialisitem_menu = {this.set_edit_materialisitem_menu}
          set_create_costsitem_menu = {this.set_create_costsitem_menu}
          set_edit_costsitem_menu = {this.set_edit_costsitem_menu}
          set_edit_workitem_menu = {this.set_edit_workitem_menu}
        />
        <ApplicationInformation
          application={this.state.application}></ApplicationInformation>

        <ModalMenu ref={this.modalmenu} />
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<App />, document.getElementById("site_assessment_container"));
}

loadReact();