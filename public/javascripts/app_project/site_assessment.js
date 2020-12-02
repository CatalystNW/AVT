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
    $.ajax({
      url: "../materialsitem",
      type:"POST",
      data: form_data,
      success: function(result, textStatus, xhr) {
        if (menu_callback)
          menu_callback();
        data_callback_handler(result);
      }
    })
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
        if (menu_callback)
          menu_callback();
        if (data_callback)
          data_callback(result);
      }
    })
  },
  delete_item(materialsItem_id, callback) {
    $.ajax({
      url: "../materialsitem/" + materialsItem_id,
      type: "DELETE",
      success: function(result, textStatus, xhr) {
        if (callback) {
          callback(materialsItem_id);
        }
      }
    });
  }
}

class WorkItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.workitem;
    console.log(this.state);
  }

  set_handleit_handler = (server_data) => {
    this.setState({
      handleit: server_data.handleit,
    });
  }

  onChange_handleit = (event) => {
    funkie.set_handleit(event.target.getAttribute("workitem_id"), this.set_handleit_handler);
  }

  add_item = (materialsItem_data) => {
    this.setState({
      materialsItems: [materialsItem_data, ...this.state.materialsItems],
    })
  }

  onClick_create_item =(e) => {
    this.props.set_create_materialsitem_menu(e, this.add_item);
  }

  remove_item = (materialsItem_id) => {
    var mlist = [],
        m = this.state.materialsItems;
    for (var i=0;i<m.length; i++) {
      if (m[i]._id != materialsItem_id)
        mlist.push(Object.assign({}, m[i]));
    }
    this.setState({materialsItems: mlist});
  }

  onClick_delete_item = (e) => {
    e.preventDefault();
    var description = e.target.getAttribute("description"),
        item_id = e.target.getAttribute("item_id");
    var result = window.confirm("Are you sure you want to delete " + description + "?");
    if (result) {
      funkie.delete_item(item_id, this.remove_item)
    }
  }
  onClick_edit_item = (e) => {
    e.preventDefault();
    console.log("del");
  }

  create_materialslist = () => {
    var total = 0, cost;
    return (
      <table className="table">
          <thead>
            <tr>
              <th scope="col" className="col-sm-1">#</th>
              <th scope="col" className="col-sm-5">Description</th>
              <th scope="col" className="col-sm-1">Price</th>
              <th scope="col" className="col-sm-3">Vendor</th>
              <th scope="col" className="col-sm-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {this.state.materialsItems.map((materialsItem, index) => {
              {cost = (parseFloat(materialsItem.price) * parseInt(materialsItem.quantity) * 100)/ 100;
                total += cost;}
              return (
                <tr key={"row"+materialsItem._id}>
                  <td className="col-sm-1" key={"options-"+materialsItem._id}>
                    {materialsItem.quantity}
                  </td>
                  <td className="col-sm-5" key={"desc-"+materialsItem._id}>
                    {materialsItem.description}</td>
                  <td className="col-sm-1" key={"price-"+materialsItem._id}>
                    {materialsItem.price}</td>
                  <td className="col-sm-3"key={"vendor-"+materialsItem._id}>{materialsItem.vendor}</td>
                  <td className="col-sm-2"key={"del-"+materialsItem._id}>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" data-toggle="dropdown">
                        {cost}
                      </button>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" 
                          description={materialsItem.description}
                          item_id={materialsItem._id}
                          onClick={this.onClick_delete_item}>Delete</a>
                        <a className="dropdown-item" item_id={materialsItem._id}
                          onClick={this.onClick_edit_item}>Edit</a>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td className="col-sm-10" colSpan="4">Total</td>
              <td className="col-sm-2" >{total}</td>
            </tr>
          </tfoot>
        </table>
    );
  }
  
  render() {
    return (
    <div className="card">
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
          onClick={this.onClick_create_item}
          workitem_id={this.state._id}
          data-toggle="modal" 
          data-target="#modalMenu">+ Item
        </button>
        {this.create_materialslist()}
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
      <div className="col-sm-12 col-lg-8 overflow-auto" style={divStyle}
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
              set_create_materialsitem_menu={this.props.set_create_materialsitem_menu}
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

  set_create_materialsitem_menu = (e, materialsitem_handler) => {
    var data = {
      workitem_id: e.target.getAttribute("workitem_id")
    }
    this.modalmenu.current.show_menu(
      "create_materialsitem",
      funkie.create_materialsitem,
      data,
      materialsitem_handler,
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