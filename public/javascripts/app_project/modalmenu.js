var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { ModalMenu };

var ModalMenu = function (_React$Component) {
  _inherits(ModalMenu, _React$Component);

  function ModalMenu(props) {
    _classCallCheck(this, ModalMenu);

    var _this = _possibleConstructorReturn(this, (ModalMenu.__proto__ || Object.getPrototypeOf(ModalMenu)).call(this, props));

    _this.componentDidMount = function () {
      var that = _this;
      $("#modalMenu").on('hidden.bs.modal', function () {
        that.setState({ type: "" });
      });
    };

    _this.close_menu = function () {
      $("#modalMenu").modal("hide");
      _this.setState({
        type: "", prev_data: null,
        additional_data: null,
        submit_form_handler: null,
        handle_data_callback: null
      });
      $("#save-btn").prop("disabled", false);
      // $("#modalmenu-form")[0].reset();
    };

    _this.get_data = function () {
      var data = {};
      if (_this.state.additional_data) {
        for (var k in _this.state.additional_data) {
          data[k] = _this.state.additional_data[k];
        }
      }

      var formData = new FormData($("#modalmenu-form")[0]);

      if (_this.state.type == "create_workitem") {
        formData.set("handleit", formData.get("handleit") == "on" ? true : false);
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = formData.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          data[key] = formData.get(key);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (_this.state.type == "edit_materialsitem") {
        data["quantity"] = parseInt(formData.get("quantity"));
        data["price"] = parseFloat(formData.get("price"));
        data["cost"] = data["quantity"] * data["price"];
      }
      return data;
    };

    _this.onSubmit = function (event) {
      event.preventDefault();
      $("#save-btn").prop("disabled", true);
      if (_this.state.submit_form_handler) {
        var data = _this.get_data();

        _this.state.submit_form_handler(data, _this.close_menu, _this.state.handle_data_callback);
      } else {
        _this.close_menu();
      }
    };

    _this.state = {
      type: "",
      submit_form_callback: null,
      title: "",
      additional_data: null,
      handle_data_callback: null
    };
    return _this;
  }

  _createClass(ModalMenu, [{
    key: "show_menu",


    /**
     * Creates the modal menu and then uses modal.show to reveal it.
     * Needs to separate submit & handle callbacks because need to also run
     *  function to close and clean up menu.
     * @param {*} type : type of menu to create
     * @param {*} submit_form_handler : handler that will handle form submission
     * @param {*} additional_data : any additional data Obj passed to submit form handler
     * @param {*} handle_data_callback : callback passed to submit form handler
     *    that will edit the HTML elements after ajax success
     * @param {String} page_type Page type that is calling the modal menu
     */
    value: function show_menu(type, submit_form_handler, additional_data, handle_data_callback) {
      var page_type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      if (type == "create_workitem") {
        this.setState({ type: type, title: "Create WorkItem",
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          prev_data: {},
          handle_data_callback: handle_data_callback,
          page_type: page_type
        }, function () {
          $("#modalMenu").modal("show");
        });
      } else if (type == "edit_workitem") {
        this.setState({
          type: type, title: "Edit WorkItem",
          submit_form_handler: submit_form_handler,
          additional_data: { workitem_id: additional_data._id },
          prev_data: additional_data,
          handle_data_callback: handle_data_callback,
          page_type: page_type
        }, function () {
          $("#modalMenu").modal("show");
        });
      } else if (type == "create_materialsitem") {
        this.setState({
          type: type, title: "Create Materials Item",
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          prev_data: {},
          handle_data_callback: handle_data_callback
        }, function () {
          $("#modalMenu").modal("show");
        });
      } else if (type == "edit_materialsitem") {
        this.setState({
          type: type, title: "Edit Materials Item",
          submit_form_handler: submit_form_handler,
          additional_data: { materialsItem_id: additional_data._id },
          handle_data_callback: handle_data_callback,
          prev_data: additional_data
        }, function () {
          $("#modalMenu").modal("show");
        });
      } else if (type == "create_partner") {
        this.setState({
          type: type, title: "Create Partner",
          submit_form_handler: submit_form_handler,
          additional_data: additional_data,
          handle_data_callback: handle_data_callback,
          prev_data: additional_data
        }, function () {
          $("#modalMenu").modal("show");
        });
      } else if (type == "edit_partner") {
        this.setState({
          type: type, title: "Edit Partner",
          submit_form_handler: submit_form_handler,
          additional_data: { partner_id: additional_data.partner_id },
          handle_data_callback: handle_data_callback,
          prev_data: additional_data
        }, function () {
          $("#modalMenu").modal("show");
        });
      }
    }
  }, {
    key: "create_menu",
    value: function create_menu() {
      if (this.state.type == "create_workitem" || this.state.type == "edit_workitem") {
        // Prevent creating handleit work item in site assessment
        // var handleit_form = (this.state.type == "create_workitem") ?
        //   (<div className="form-check">
        //     <input type="checkbox" name="handleit" id="handleit-check"></input>
        //     <label className="form-check-label" htmlFor="handleit-check">Handle-It</label>
        //   </div>) : null;

        var comments_input = void 0;
        if (this.state.page_type == "project") {
          comments_input = React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Project Comments"
            ),
            React.createElement("textarea", { className: "form-control", name: "project_comments",
              defaultValue: this.state.type == "edit_workitem" ? this.state.prev_data.project_comments : "", id: "comments-input" })
          );
        } else if (this.state.page_type == "vetting") {
          comments_input = React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Vetting Comments"
            ),
            React.createElement("textarea", { className: "form-control", name: "vetting_comments",
              defaultValue: this.state.type == "edit_workitem" ? this.state.prev_data.vetting_comments : "", id: "comments-input" })
          );
        } else {
          comments_input = React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Assessment Comments"
            ),
            React.createElement("textarea", { className: "form-control", name: "assessment_comments",
              defaultValue: this.state.type == "edit_workitem" ? this.state.prev_data.assessment_comments : "", id: "comments-input" })
          );
        }

        return React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Name"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "name", id: "name-input",
              defaultValue: this.state.type == "edit_workitem" ? this.state.prev_data.name : "", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Description"
            ),
            React.createElement("textarea", { className: "form-control", name: "description", id: "desc-input",
              defaultValue: this.state.type == "edit_workitem" ? this.state.prev_data.description : "", required: true })
          ),
          comments_input
        );
      } else if (this.state.type == "create_materialsitem") {
        return React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Description"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "description", id: "description-input", defaultValue: "", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Quantity"
            ),
            React.createElement("input", { type: "number", className: "form-control", defaultValue: "", name: "quantity",
              id: "quantity-input", min: "0", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Price"
            ),
            React.createElement("input", { type: "number", className: "form-control", step: "any", defaultValue: "", name: "price",
              id: "price-input", min: "0", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Vendor"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "vendor", id: "vendor-input", defaultValue: "", required: true })
          )
        );
      } else if (this.state.type == "edit_materialsitem") {
        return React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Description"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "description",
              defaultValue: this.state.prev_data.description, id: "description-input", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Quantity"
            ),
            React.createElement("input", { type: "number", className: "form-control", name: "quantity", min: "0",
              defaultValue: this.state.prev_data.quantity, id: "quantity-input", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Price"
            ),
            React.createElement("input", { type: "number", className: "form-control", step: "any", name: "price", min: "0",
              defaultValue: this.state.prev_data.price, id: "price-input", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              null,
              "Vendor"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "vendor",
              defaultValue: this.state.prev_data.vendor, id: "vendor-input", required: true })
          )
        );
      } else if (this.state.type == "create_partner" || this.state.type == "edit_partner") {
        return React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { htmlFor: "name-input" },
              "Partner Name"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "name",
              defaultValue: this.state.type == "edit_partner" ? this.state.prev_data.org_name : "",
              id: "name-input", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { htmlFor: "contact-input" },
              "Contact Name"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "contact",
              defaultValue: this.state.type == "edit_partner" ? this.state.prev_data.contact_name : "",
              id: "contact-input", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { htmlFor: "address-input" },
              "Address"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "address",
              defaultValue: this.state.type == "edit_partner" ? this.state.prev_data.org_address : "",
              id: "address-input", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { htmlFor: "phone-input" },
              "Phone"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "phone",
              defaultValue: this.state.type == "edit_partner" ? this.state.prev_data.contact_phone : "",
              id: "phone-input", required: true })
          ),
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "label",
              { htmlFor: "email-input" },
              "Email"
            ),
            React.createElement("input", { type: "text", className: "form-control", name: "email",
              defaultValue: this.state.type == "edit_partner" ? this.state.prev_data.contact_email : "",
              id: "email-input", required: true })
          )
        );
      } else {
        return React.createElement("div", null);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "modal", tabIndex: "-1", role: "dialog", id: "modalMenu" },
        React.createElement(
          "div",
          { className: "modal-dialog", role: "document" },
          React.createElement(
            "div",
            { className: "modal-content" },
            React.createElement(
              "div",
              { className: "modal-header" },
              this.state.title,
              React.createElement(
                "button",
                { type: "button", className: "close", "data-dismiss": "modal" },
                React.createElement(
                  "span",
                  null,
                  "\xD7"
                )
              )
            ),
            React.createElement(
              "form",
              { onSubmit: this.onSubmit, id: "modalmenu-form" },
              React.createElement(
                "div",
                { className: "modal-body" },
                this.create_menu()
              ),
              React.createElement(
                "div",
                { className: "modal-footer" },
                React.createElement(
                  "button",
                  { type: "submit", className: "btn btn-primary", id: "save-btn" },
                  "Save"
                ),
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-secondary", "data-dismiss": "modal" },
                  "Close"
                )
              )
            )
          )
        )
      );
    }
  }]);

  return ModalMenu;
}(React.Component);