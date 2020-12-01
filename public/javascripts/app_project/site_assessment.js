// Note: app_id is a variable set by the page

var funkie = {
  load_application(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../application/"+app_id,
      success: function(data, textStatus, xhr) {
        if (callback)
          callback(data);
      }
    });
  },
  calculate_page_height() {
    return window.innerHeight - document.getElementById("cPart").offsetHeight
    - document.getElementById("navbarResponsive").offsetHeight - 40
    - document.getElementsByClassName("small")[0].offsetHeight;
  },
  get_assessment(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../site_assessment/" + app_id,
      success: function(data, textStatus, xhr) {
        if (callback) {
          callback(data);
        }
      }
    });
  },
  create_workitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../workitems",
      type:"POST",
      data: form_data,
      success: function(result, textStatus, xhr) {
        if (menu_callback)
          menu_callback();
        data_callback_handler(result);
      }
    });
  },
  create_materialsitem(form_data, menu_callback, data_callback_handler) {
    console.log(form_data);
  },
  set_handleit(workitem_id, data_callback) {
    $.ajax({
      url: "../workitems",
      type: "PATCH",
      data: {
        property: "handleit",
        workitem_id: workitem_id,
      },
      success: function(result, textStatus, xhr) {
        if (data_callback)
          data_callback(result);
      }
    })
  },
}

class ModalMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      submit_form_callback: null,
      title: "",
      additional_data: null,
      handle_data_callback: null,
    }
  }

  close_menu() {
    $("#modalMenu").modal("hide");
    $("#modalmenu-form")[0].reset();
  }

  get_data = () => {
    var data = {};
    if (this.state.additional_data) {
      for (var k in this.state.additional_data) {
        data[k] = this.state.additional_data[k];
      }
    }

    if (this.state.type=="create_workitem") {
      var formData = new FormData($("#modalmenu-form")[0]);
      formData.set("handleit", formData.get("handleit") == "on" ? true:false);
      for (var key of formData.keys()) {
        data[key] = formData.get(key);
      }
    }
    return data;
  }

  onSubmit = (event) => {
    event.preventDefault();
    if (this.state.submit_form_handler) {
      var data = this.get_data();
      
      this.state.submit_form_handler(
        data, this.close_menu, this.state.handle_data_callback);
    }
  }

  show_menu(type, submit_form_handler, additional_data, handle_data_callback) {
    if (type == "create_workitem") {
      this.setState(
        { type: type, title: "Create WorkItem", 
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          handle_data_callback: handle_data_callback,
      });
    } else if (type == "create_materialsitem") {
      this.setState(
        {
          type: type, title: "Create Item",
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          handle_data_callback: handle_data_callback,
        }
      )
    }
  }

  create_menu() {
     if (this.state.type == "create_workitem") {
      return (<div>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" name="name" id="name-input" required></input>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" name="description" id="desc-input" required></textarea>
        </div>
        <div className="form-group">
          <label>Assessment Comments</label>
          <textarea className="form-control" name="assessment_comments" id="comments-input"></textarea>
        </div>
        <div className="form-check">
          <input type="checkbox" name="handleit" id="handleit-check"></input>
          <label className="form-check-label" htmlFor="handleit-check">Handle-It</label>
        </div>
      </div>);
    } else if (this.state.type == "create_materialsitem") {
      return (<div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" className="form-control" name="description" id="description-input" required></input>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input type="number" className="form-control" name="quantity" id="quantity-input" required></input>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" className="form-control" name="price" id="price-input" required></input>
        </div>
        <div className="form-group">
          <label>Vendor</label>
          <input type="text" className="form-control" name="vendor" id="vendor-input" required></input>
        </div>
      </div>)
    } else {
      return <div></div>
    }
  }

  render() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" id="modalMenu">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              {this.state.title}
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <form onSubmit={this.onSubmit} id="modalmenu-form">
              <div className="modal-body">
                {this.create_menu()}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.workitem;
  }

  set_handleit_handler = (server_data) => {
    this.setState({
      handleit: server_data.handleit,
    });
  }

  onChange_handleit = (event) => {
    funkie.set_handleit(event.target.getAttribute("workitem_id"), this.set_handleit_handler);
  }

  render() {
    return (<div className="card">
    <div className="card-body">
      <h5 className="card-title">{this.state.name}</h5>
      <b>Description</b>
      <p className="card-text">
        {this.state.description}
      </p>

      <b>Vetting Comments</b>
      <p className="card-text">
        {this.state.vetting_comments}
      </p>

      <b>Assessment Comments</b>
      <p className="card-text">
        {this.state.assessment_comments}
      </p>

      <p className="card-text">
        <b>Handle-It </b> 
        <input type="checkbox" name="handleit" id="handleit-check"
          checked={this.state.handleit}
          workitem_id={this.state._id}
          onChange={this.onChange_handleit}></input>
        
      </p>

      <b>Materials List</b>
      <button type="button" className="btn btn-primary btn-sm"
        onClick={this.props.set_create_materialsitem_menu}
        workitem_id={this.state._id}
        data-toggle="modal" data-target="#modalMenu">+ Item</button>
    </div>
  </div>);
  }
}

class AssessmentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.assessment
  }

  add_workitem = (workitem) => {
    this.setState({
      workItems: [workitem, ...this.state.workItems],
    });
  }

  render() {
    const divStyle = {
      height: funkie.calculate_page_height().toString() + "px",
    };

    return (
      <div className="col-sm-12 col-lg-6 overflow-auto" style={divStyle}
        id="assessment-container" key={this.props.id}>
          <h2>Work Items</h2>
          <button type="button" className="btn btn-primary" 
            onClick={this.props.set_create_workitem_menu}
            data-toggle="modal" data-target="#modalMenu">
            Create Work Item
          </button>
          {this.state.workItems.map((workitem) => {
            return (
            <WorkItem 
              workitem={workitem}
              key={workitem._id+"-workitem-card"}></WorkItem>);
          })}

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
      assessments: [],
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
      that.setState({assessments: [data.site_assessment,]});
    });
  }

  add_materialsitem = (materialsitem) => {
    console.log(materialsitem);
  }

  set_create_workitem_menu =() => {
    var data = {
      assessment_id: this.state.assessments[0]._id, 
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

  set_create_materialsitem_menu = (e) => {
    var data = {
      workitem_id: e.target.getAttribute("workitem_id")
    }
    this.modalmenu.current.show_menu(
      "create_materialsitem",
      funkie.create_materialsitem,
      data,
      this.add_materialsitem,
    )
  }

  render() {
    const application_information = this.state.applications.map((application) => {
      return <ApplicationInformation key={application.id} 
        application={application}></ApplicationInformation>
    });

    const assessment_menu = this.state.assessments.map((assessment) => {
      return <AssessmentMenu 
        ref={this.assessmentmenu}
        key={assessment._id} id={assessment._id}
        assessment={assessment}
        application_id={app_id} 
        set_create_workitem_menu={this.set_create_workitem_menu}
        set_create_materialsitem_menu={this.set_create_materialsitem_menu}
      />
    });
    return (
      <div>
        {assessment_menu}
        {application_information}

        <ModalMenu ref={this.modalmenu} />
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<App />, document.getElementById("site_assessment_container"));
}

loadReact();