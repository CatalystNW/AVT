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

  componentDidMount = () => {
    var that = this;
    $("#modalMenu").on('hidden.bs.modal', function() {
      that.setState({type: ""});
    });
  }

  close_menu = () => {
    $("#modalMenu").modal("hide");
    this.setState({
      type: "", prev_data: null,
      additional_data: null,
      submit_form_handler: null,
      handle_data_callback: null,
    });
    $("#save-btn").prop("disabled", false);
    // $("#modalmenu-form")[0].reset();
  }

  get_data = () => {
    var data = {};
    if (this.state.additional_data) {
      for (var k in this.state.additional_data) {
        data[k] = this.state.additional_data[k];
      }
    }

    var formData = new FormData($("#modalmenu-form")[0]);

    if (this.state.type=="create_workitem") {
      formData.set("handleit", formData.get("handleit") == "on" ? true:false); 
    }

    for (var key of formData.keys()) {
      data[key] = formData.get(key);
    }

    if (this.state.type=="edit_materialsitem") {
      data["quantity"] = parseInt(formData.get("quantity"));
      data["price"] = parseFloat(formData.get("price"));
      data["cost"] = data["quantity"] * data["price"];
    }    
    return data;
  }

  onSubmit = (event) => {
    event.preventDefault();
    $("#save-btn").prop("disabled", true);
    if (this.state.submit_form_handler) {
      var data = this.get_data();
      
      this.state.submit_form_handler(
        data, this.close_menu, this.state.handle_data_callback);
    } else {
      this.close_menu();
    }
  }

  /**
   * Creates the modal menu and then uses modal.show to reveal it.
   * Needs to separate submit & handle callbacks because need to also run
   *  function to close and clean up menu.
   * @param {*} type : type of menu to create
   * @param {*} submit_form_handler : handler that will handle form submission
   * @param {*} additional_data : any additional data Obj passed to submit form handler
   * @param {*} handle_data_callback : callback passed to submit form handler
   *    that will edit the HTML elements after ajax success
   */
  show_menu(type, submit_form_handler, additional_data, handle_data_callback) {
    if (type == "create_workitem") {
      this.setState(
        { type: type, title: "Create WorkItem", 
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          prev_data: {},
          handle_data_callback: handle_data_callback,
      }, ()=> {$("#modalMenu").modal("show");});
    } else if (type == "edit_workitem") {
      this.setState({
        type: type, title: "Edit WorkItem",
        submit_form_handler: submit_form_handler,
        additional_data: {workitem_id: additional_data._id},
        prev_data: additional_data,
        handle_data_callback: handle_data_callback,
      }, ()=> {$("#modalMenu").modal("show");});
    } else if (type == "create_materialsitem") {
      this.setState(
        {
          type: type, title: "Create Materials Item",
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          prev_data: {},
          handle_data_callback: handle_data_callback,
        }, ()=> {$("#modalMenu").modal("show");});
    } else if (type == "edit_materialsitem") {
      this.setState(
        {
          type: type, title: "Edit Materials Item",
          submit_form_handler: submit_form_handler,
          additional_data: {materialsItem_id: additional_data._id,},
          handle_data_callback: handle_data_callback,
          prev_data: additional_data,
        }, ()=> {$("#modalMenu").modal("show");}
      )
    } else if (type == "create_partner") {
      this.setState(
        {
          type: type, title: "Create Partner",
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          handle_data_callback: handle_data_callback,
          prev_data: additional_data,
        }, ()=> {$("#modalMenu").modal("show");}
      )
    }
  }

  create_menu() {
     if (this.state.type == "create_workitem" || this.state.type == "edit_workitem") {
      var handleit_form = (this.state.type == "create_workitem") ?
        (<div className="form-check">
          <input type="checkbox" name="handleit" id="handleit-check"></input>
          <label className="form-check-label" htmlFor="handleit-check">Handle-It</label>
        </div>) : null;
      return (<div>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" name="name" id="name-input" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.name : ""}  required></input>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" name="description" id="desc-input" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.description : ""} required></textarea>
        </div>
        <div className="form-group">
          <label>Assessment Comments</label>
          <textarea className="form-control" name="assessment_comments" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.assessment_comments : ""} id="comments-input"></textarea>
        </div>
        {handleit_form}
      </div>);
    } else if (this.state.type == "create_materialsitem") {
      return (<div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" className="form-control" name="description" id="description-input" defaultValue="" required></input>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input type="number" className="form-control" defaultValue="" name="quantity" 
            id="quantity-input" min="0" required></input>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" className="form-control" step="any" defaultValue="" name="price" 
            id="price-input" min="0" required></input>
        </div>
        <div className="form-group">
          <label>Vendor</label>
          <input type="text" className="form-control" name="vendor" id="vendor-input" defaultValue="" required></input>
        </div>
      </div>);
    } else if (this.state.type == "edit_materialsitem") {
      return (<div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" className="form-control" name="description" 
            defaultValue={this.state.prev_data.description} id="description-input" required></input>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input type="number" className="form-control" name="quantity" min="0"
            defaultValue={this.state.prev_data.quantity} id="quantity-input" required></input>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" className="form-control" step="any" name="price" min="0"
            defaultValue={this.state.prev_data.price} id="price-input" required></input>
        </div>
        <div className="form-group">
          <label>Vendor</label>
          <input type="text" className="form-control" name="vendor" 
            defaultValue={this.state.prev_data.vendor} id="vendor-input" required></input>
        </div>
      </div>);
    } else if (this.state.type == "create_partner") {
      return (<div>
        <div className="form-group">
          <label htmlFor="name-input">Partner Name</label>
          <input type="text" className="form-control" name="name" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.description : ""}
            id="name-input" required></input>
        </div>
        <div className="form-group">
          <label htmlFor="contact-input">Contact Name</label>
          <input type="text" className="form-control" name="contact" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.description : ""}
            id="contact-input" required></input>
        </div>
        <div className="form-group">
          <label htmlFor="address-input">Address</label>
          <input type="text" className="form-control" name="address" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.description : ""}
            id="address-input" required></input>
        </div>
        <div className="form-group">
          <label htmlFor="phone-input">Phone</label>
          <input type="text" className="form-control" name="phone" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.description : ""}
            id="phone-input" required></input>
        </div>
        <div className="form-group">
          <label htmlFor="email-input">Email</label>
          <input type="text" className="form-control" name="email" 
            defaultValue={this.state.type == "edit_workitem" ? this.state.prev_data.description : ""}
            id="email-input" required></input>
        </div>
      </div>);
    } else {
      return (<div></div>);
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
                <button type="submit" className="btn btn-primary" id="save-btn">Save</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}