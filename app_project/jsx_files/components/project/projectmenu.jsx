import { Checklist } from "../../project/checklist.js"
import { WorkItem } from "../../workitem.js"
import { CostSummary } from "../../CostSummary.js"
import { PartnerMenu } from "../PartnerMenu.js"
import { DateMenuRow } from "../../DateMenuRow.js"
import { PdfButtons } from "../PdfButtons.js"

export {
  ProjectMenu,
}

/**
 * Requires props.set_create_workitem_menu(),
 */
class ProjectMenu extends React.Component {
  constructor(props) {
    super(props);
    // Reference of State: { workItems: [], assignable_users: [],  volunteer_hours: 0,
    //   site_host: "", crew_chief: "", project_advocate: "", };
    this.state = this.props.project_data;
    this.state.assignable_users = [];

    this.load_assignable_users();
    this.planning_checklist = React.createRef();
    this.wrapup_checklist = React.createRef();
    this.costsummary = React.createRef();

    this.volunteer_hours_timer = null;
    this.site_host_timer = null;
    this.crew_chief_timer = null;
    this.project_advocate_timer = null;
  }

  componentDidMount() {
    var that = this;
    // Tab changed. Newer versions of Bootstrap has a slight change in this
    // Load data when cost-summary is shown
    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
      if (e.target.id == "nav-cost-summary-tab") {
        that.costsummary.current.load_data("project", project_id);
      }
    });
    // Set CSS for the fixed nav tabs
    $("#nav-project-tabContent").css(
        "padding-top", $("#project-nav-container").height());
    $("#project-nav-container").css(
      "width", $("#nav-project-tabContent").width());
  }

  // Load users for checklists select elements (as possible owners)
  load_assignable_users = () => {
    $.ajax({
      url: "/app_project/projects/assignable_users",
      type: "GET",
      context: this,
      success: function(users) {
        this.setState({
          assignable_users: users,
        });
      },
    })
  };

  add_workitem = (workitem) => {
    this.setState({
      workItems: [workitem, ...this.state.workItems],
    })
  };

  remove_workitem = (workitem_id) => {
    var new_workitems = [];
    for(var i=0; i< this.state.workItems.length; i++) {
      if (this.state.workItems[i]._id != workitem_id) {
        new_workitems.push(this.state.workItems[i]);
      }
    }
    this.setState({
      workItems: new_workitems,
    });
  }

  onChange_date_callback = (data) => {
    data.property = data.date_type;
    $.ajax({
      url: "/app_project/projects/" + this.state._id,
      type: "PATCH",
      data: data,
      context: this,
    });
  };

  onChange_status = (e) => {
    const property = e.target.name,
          value = e.target.value;
    if (value == "complete") {
      const result = window.confirm("Are you sure you want to set the project to complete?");
      if (!result) {
        return;
      }
    }
    $.ajax({
      url: "/app_project/projects/" + this.state._id,
      type: "PATCH",
      data: {
        property: property,
        value: value,
      },
      context: this,
      success: function() {
        this.setState({
          [property]: value,
        });
      },
      error: function(xhr, textStatus, e) {
        if (xhr.status == 423) {
          console.log("The project is completed and locked.");
        } else {
          window.alert("Please check that all work items are complete (status is set to completed in the work items page)");
        }
      },
    });
  }

  onChange_inputs_timer = (e) => {
    var property_type = e.target.getAttribute("property_type"),
        value = e.target.value;
    clearTimeout(this[property_type + "_timer"]);

    this.setState({[property_type]: value});

    this[property_type + "_timer"] = setTimeout(() => {
      var data = {
        property: property_type,
        value: value,
      }
      $.ajax({
        url: "/app_project/projects/" + this.state._id,
        type: "PATCH",
        data: data,
        context: this,
      });
    }, 700);
  };

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
              <a className="nav-link active" id="nav-info-tab" data-toggle="tab" 
                href="#nav-info" role="tab">Info</a>
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
              <a className="nav-link" id="nav-planning-tab" data-toggle="tab" 
                href="#nav-planning" role="tab">Planning</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-partners-tab" data-toggle="tab" 
                href="#nav-partners" role="tab">Partners</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-wrapup-tab" data-toggle="tab" 
                href="#nav-wrapup" role="tab">Wrap-Up</a>
            </li>
          </ul>
        </div>

        <div className="tab-content overflow-auto" id="nav-project-tabContent">
          <div className="tab-pane show active" id="nav-info" role="tabpanel">
            <DateMenuRow title="Start Date" 
              date_type="project_start_date"
              date={this.state.start}
              change_callback={this.onChange_date_callback}
            /> 
            <DateMenuRow title="End Date" 
              date_type="project_end_date"
              date={this.state.end}
              change_callback={this.onChange_date_callback}
            />
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Project Name</label>
              <div className="col-sm-4">
                <input type="text" className="form-control" 
                  property_type="name"
                  onChange={this.onChange_inputs_timer}
                  value={this.state.name}></input>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label" 
                htmlFor="status-select">Project Status</label>
              <div className="col-sm-4">
                <select className="form-control" 
                    onChange={this.onChange_status}
                    id="status-select"
                    name="status"
                    value={this.state.status}>
                  <option value="upcoming">Upcoming</option>
                  <option value="in_progress">In Progress</option>
                  <option value="complete">Complete</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Volunteer Hours</label>
              <div className="col-sm-4">
                <input type="number" className="form-control" 
                  property_type="volunteer_hours"
                  onChange={this.onChange_inputs_timer}
                  value={this.state.volunteer_hours}></input>
              </div>
            </div>

            <PdfButtons type="project" project_id={this.state._id} />

            <h2>Leaders</h2>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Crew Chief</label>
              <div className="col-sm-4">
                <input type="type" className="form-control" 
                  property_type="crew_chief"
                  onChange={this.onChange_inputs_timer}
                  value={this.state.crew_chief}></input>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Project Advocate</label>
              <div className="col-sm-4">
                <input type="type" className="form-control" 
                  property_type="project_advocate"
                  onChange={this.onChange_inputs_timer}
                  value={this.state.project_advocate}></input>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Site Host</label>
              <div className="col-sm-4">
                <input type="type" className="form-control" 
                  property_type="site_host"
                  onChange={this.onChange_inputs_timer}
                  value={this.state.site_host}></input>
              </div>
            </div>
          </div>
          <div className="tab-pane" id="nav-cost-summary" role="tabpanel">
            <CostSummary ref={this.costsummary}/>
          </div>
          <div className="tab-pane" id="nav-partners" role="tabpanel">
            <PartnerMenu 
              type="project" project_id={this.state._id}
              partners={this.state.partners}
              getModalMenu={this.props.getModalMenu}
            />
          </div>
          <div className="tab-pane" id="nav-planning" role="tabpanel">
            <Checklist ref={this.planning_checklist} 
              type="planning"
              assignable_users={this.state.assignable_users}
              project_id={project_id}/>
          </div> 
          <div className="tab-pane" id="nav-wrapup" role="tabpanel">
            <Checklist ref={this.planning_checklist} 
              type="wrapup"
              assignable_users={this.state.assignable_users}
              project_id={project_id}/>
          </div>
          <div className="tab-pane" id="nav-workitem" role="tabpanel">
            {!this.state.handleit ?
              <button type="button" className="btn btn-primary" 
                onClick={this.props.set_create_workitem_menu}
              >Create Work Item</button> : null
            }
            
            <div>
              {this.state.workItems.map((workitem, index) => {
                return (
                <WorkItem
                  workitem={workitem} page_type={"project"}
                  remove_workitem={this.remove_workitem}
                  set_edit_materialisitem_menu={this.props.set_edit_materialisitem_menu}
                  set_create_materialsitem_menu={this.props.set_create_materialsitem_menu}
                  set_edit_workitem_menu = {this.props.set_edit_workitem_menu}
                  key={workitem._id+"-workitem-card"} 
                  />);
              })}
            </div>
          </div>
        </div>
      </div>);
  }
}