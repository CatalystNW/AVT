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

  render() {
    return (
    <div>
      <ProjectMenu ref={this.project_menu} 
        set_create_workitem_menu={this.set_create_workitem_menu}
      />
      <ApplicationInformation
        application={this.state.application}
      />
      <ModalMenu ref={this.modalmenu} />
    </div>);
  }
}

/**
 * Requires props.set_create_workitem_menu(),
 */
class ProjectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workItems: [],
    }
  }

  componentDidMount() {
    var that = this;
    // Tab changed. Newer versions of Bootstrap has a slight change in this
    // Load data when cost-summary is shown
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
      if (e.target.id == "nav-cost-summary-tab") {
        that.costsummary.current.load_data();
      }
    });
    $("#nav-project-tabContent").css(
        "padding-top", $("#project-nav-container").height());
    $("#project-nav-container").css(
      "width", $("#nav-project-tabContent").width());
  }

  add_workitem = (workitem) => {
    this.setState({
      workItems: [workitem, ...this.state.workItems],
    })
  };

  load_project(project_data) {
    this.setState(state => {
      return Object.assign({}, state, project_data);
    });
  }

  render () {
    const divStyle = {
      height: funkie.calculate_page_height().toString() + "px",
    };
    return (
      <div className="col-sm-12 col-lg-8" style={divStyle}
        id="assessment-container">
        <div id="project-nav-container">
          <ul className="nav nav-tabs" id="nav-assessment-tabs" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="nav-property-tab" data-toggle="tab" 
                href="#nav-workitem" role="tab">Work Items</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-cost-summary-tab" data-toggle="tab" 
                href="#nav-cost-summary" role="tab">Cost Summary</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-checklist-tab" data-toggle="tab" 
                href="#nav-checklist" role="tab">Checklist</a>
            </li>
          </ul>
        </div>

        <div className="tab-content overflow-auto" id="nav-project-tabContent">
          <div className="tab-pane" id="nav-checklist" role="tabpanel">
            {/* <AssessmentChecklist ref={this.checklist}
              assessment={{}}
              vetting_summary = {this.props.vetting_summary}
            /> */}
          </div>
          <div className="tab-pane" id="nav-cost-summary" role="tabpanel">
            {/* <CostSummary ref={this.costsummary}/> */}
          </div> 
          <div className="tab-pane show active" id="nav-workitem" role="tabpanel">
            <button type="button" className="btn btn-primary" 
              onClick={this.props.set_create_workitem_menu}
            >Create Work Item</button>
            <div>
              {this.state.workItems.map((workitem, index) => {
                return (
                <WorkItem
                  workitem={workitem}
                  // remove_workitem={this.remove_workitem}
                  // set_edit_materialisitem_menu={this.props.set_edit_materialisitem_menu}
                  set_create_materialsitem_menu={this.props.set_create_materialsitem_menu}
                  // set_edit_workitem_menu = {this.props.set_edit_workitem_menu}
                  key={workitem._id+"-workitem-card"} 
                  />);
              })}
            </div>
          </div>
        </div>
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<ProjectApp />, document.getElementById("project_container"));
}

loadReact();