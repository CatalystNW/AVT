// Note: WorkItem uses the data in props saves it in state
// and updates it in state, thus becomes disconnected with the data here
class AssessmentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workItems: [],
    }
    this.checklist = React.createRef();
    this.costsummary = React.createRef();
  }

  change_assessment = (assessment) => {
    this.setState(assessment);
    this.checklist.current.load_assessment(assessment);
  };

  componentDidMount() {
    var that = this;
    // Tab changed. Newer versions of Bootstrap has a slight change in this
    // Load data when cost-summary is shown
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
      if (e.target.id == "nav-cost-summary-tab") {
        that.costsummary.current.load_data();
      }
    });
    $("#nav-assessment-tabContent").css(
        "padding-top", $("#assessment-nav-container").height());
    $("#assessment-nav-container").css(
      "width", $("#nav-assessment-tabContent").width());
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
      <div className="col-sm-12 col-lg-8" style={divStyle}
        id="assessment-container">
        <div id="assessment-nav-container">
          <ul className="nav nav-tabs" id="nav-assessment-tabs" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="nav-checklist-tab" data-toggle="tab" 
                href="#nav-checklist" role="tab">Checklist</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-cost-summary-tab" data-toggle="tab" 
                href="#nav-cost-summary" role="tab">Cost Summary</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-property-tab" data-toggle="tab" 
                href="#nav-workitem" role="tab">Work Items</a>
            </li>
          </ul>
        </div>

        <div className="tab-content overflow-auto" id="nav-assessment-tabContent">
          <div className="tab-pane show active" id="nav-checklist" role="tabpanel">
            <AssessmentChecklist ref={this.checklist}
              assessment={{}}
              vetting_summary = {this.props.vetting_summary}
              set_create_costsitem_menu = {this.props.set_create_costsitem_menu}
              set_edit_costsitem_menu = {this.props.set_edit_costsitem_menu}
            />
          </div>
          <div className="tab-pane" id="nav-cost-summary" role="tabpanel">
            <CostSummary ref={this.costsummary}/>
          </div>
          <div className="tab-pane" id="nav-workitem" role="tabpanel">
            <button type="button" className="btn btn-primary" 
              onClick={this.props.set_create_workitem_menu}>
              Create Work Item
            </button>
            {this.state.workItems.map((workitem, index) => {
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