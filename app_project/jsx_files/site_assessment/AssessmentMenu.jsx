import { WorkItem } from "../components/workitem.js"
import { CostSummary } from "../components/CostSummary.js"
import { AssessmentInfoMenu } from "./AssessmentInfoMenu.js"
import { PartnerMenu } from "../components/PartnerMenu.js"

export { AssessmentMenu }

// Note: WorkItem uses the data in props saves it in state
// and updates it in state, thus becomes disconnected with the data here
class AssessmentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "pending",
      workItems: [],
      transferred: false,
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
        that.costsummary.current.load_data("site_assessment", that.state._id);
      }
    });
    $("#nav-assessment-tabContent").css(
        "padding-top", $("#assessment-nav-container").height());
    $("#assessment-nav-container").css(
      "width", $("#nav-assessment-tabContent").width());
  }

  add_workitem = (workitem) => {
    if (workitem.handleit != true) {
      this.setState({
        workItems: [workitem, ...this.state.workItems],
      });
    }
  };
  remove_workitem = (workitem_id) => {
    // Appends the original workitems to a new list
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

  changeWorkItemStatus = (workItem_id, status) => {
    this.setState(state => {
      let newWorkItems = [...state.workItems];
      for (let i=0; i<newWorkItems.length; i++) {
        if (newWorkItems[i]._id == workItem_id) {
          newWorkItems[i].status = status;
          break;
        }        
      }
      return {
        workItems: newWorkItems,
      };
    });
  };

  /**
   * Creates an array of WorkItems that are sorted by its status.
   * @returns Array[WorkItems]
   */
  createWorkItems = () => {
    // Set workitem value for sorting work items
    function getValue(workitem) {
      if (workitem.status == "to_review")
        return 0;
      else if (workitem.status == "accepted")
        return 1;
      else
        return 2;
    }
    this.state.workItems.sort((a, b) => {
      return getValue(a) - getValue(b);
    });

    return this.state.workItems.map((workitem, index) => {
      return (
      <WorkItem
        workitem={workitem} page_type={"site_assessment"}
        changeWorkItemStatus = {this.changeWorkItemStatus}
        
        remove_workitem={this.state.status != "approved" ? 
            this.remove_workitem: null}
        set_edit_materialisitem_menu={this.props.set_edit_materialisitem_menu}
        set_create_materialsitem_menu={this.props.set_create_materialsitem_menu}
        set_edit_workitem_menu = { this.state.status != "approved" ? 
          this.props.set_edit_workitem_menu : null}
        key={workitem._id+"-workitem-card"}></WorkItem>);
    });
  };

  changeStatus = (newStatus) => {
    if (newStatus == "declined") {
      const workItems = this.state.workItems;
      // Make sure all workItems are declined before allowing status change
      for (let i=0; i< workItems.length; i++) {
        if (workItems[i].status != "declined") {
          return false;
        }
      }
    }
    this.setState({status: newStatus});
    return true;
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
              <a className="nav-link active" id="nav-info-menu-tab" data-toggle="tab" 
                href="#nav-info-menu" role="tab">General Info</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-property-tab" data-toggle="tab" 
                href="#nav-workitem" role="tab">Work Items</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-cost-summary-tab" data-toggle="tab" 
                href="#nav-cost-summary" role="tab">Cost Summary</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-partner-tab" data-toggle="tab" 
                href="#nav-partner" role="tab">Partners</a>
            </li>
          </ul>
        </div>

        <div className="tab-content overflow-auto" id="nav-assessment-tabContent">
          <div className="tab-pane show active" id="nav-info-menu" role="tabpanel">
            <AssessmentInfoMenu ref={this.checklist}
              assessment={{}}
              changeStatus={this.changeStatus}
              vetting_summary = {this.props.vetting_summary}
            />
          </div>
          <div className="tab-pane" id="nav-cost-summary" role="tabpanel">
            <CostSummary ref={this.costsummary}/>
          </div>
          <div className="tab-pane" id="nav-workitem" role="tabpanel">
            {this.state.status != "approved" ? 
            (<button type="button" className="btn btn-primary" 
            onClick={this.props.set_create_workitem_menu}>
            Create Work Item
          </button>) : null
            }            
            
            {this.createWorkItems()}
          </div>
          <div className="tab-pane" id="nav-partner" role="tabpanel">
            {this.state._id ?
              (<PartnerMenu 
                type="siteAssessment" assessment_id={this.state._id}
                partners={this.state.partners}
                getModalMenu={this.props.getModalMenu}
              />) : (<div></div>)
            }
            
          </div>
        </div>
      </div>
    )
  }
}