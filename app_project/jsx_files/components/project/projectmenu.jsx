import { Checklist } from "../../project/checklist.js"
import { WorkItem } from "../../workitem.js"

export {
  ProjectMenu,
}

/**
 * Requires props.set_create_workitem_menu(),
 */
class ProjectMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { // Project data saved directly to state
      workItems: [],
      assignable_users: [],
      volunteer_hours: 0,
      site_host: "",
      crew_chief: "",
      project_advocate: "",
    };
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
    $("#nav-project-tabContent").css(
        "padding-top", $("#project-nav-container").height());
    $("#project-nav-container").css(
      "width", $("#nav-project-tabContent").width());
  }

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

  load_project(project_data) {
    this.setState(state => {
      return Object.assign({}, state, project_data);
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
              <a className="nav-link" id="nav-info-tab" data-toggle="tab" 
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
              <a className="nav-link active" id="nav-partners-tab" data-toggle="tab" 
                href="#nav-partners" role="tab">Partners</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-wrapup-tab" data-toggle="tab" 
                href="#nav-wrapup" role="tab">Wrap-Up</a>
            </li>
          </ul>
        </div>

        <div className="tab-content overflow-auto" id="nav-project-tabContent">
          <div className="tab-pane" id="nav-info" role="tabpanel">
            { this.state.start ?
              <DateMenuRow title="Start Date" 
                date_type="project_start_date"
                date={this.state.start}
                change_callback={this.onChange_date_callback}
              /> : <div></div>
            }

            { this.state.end ?
              <DateMenuRow title="End Date" 
                date_type="project_end_date"
                date={this.state.end}
                change_callback={this.onChange_date_callback}
              /> : <div></div>
            }

            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Volunteer Hours</label>
              <div className="col-sm-4">
                <input type="number" className="form-control" 
                  property_type="volunteer_hours"
                  onChange={this.onChange_inputs_timer}
                  value={this.state.volunteer_hours}></input>
              </div>
            </div>
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
          <div className="tab-pane show active" id="nav-partners" role="tabpanel">
            { this.state._id ?
            (<PartnerMenu 
              type="project" project_id={this.state._id}
              partners={this.state.partners}
              set_create_partner_menu={this.props.set_create_partner_menu}
              set_edit_partner_menu={this.props.set_edit_partner_menu}
            />) : (<div></div>)}
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
            <button type="button" className="btn btn-primary" 
              onClick={this.props.set_create_workitem_menu}
            >Create Work Item</button>
            <div>
              {this.state.workItems.map((workitem, index) => {
                return (
                <WorkItem
                  workitem={workitem}
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