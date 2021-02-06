var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { Checklist };

/**
 * Checklists loads the data checklist corresponding to AppProject
 * (either plan_checklist or wrapup_checklist) on constructor
 */

var Checklist = function (_React$Component) {
  _inherits(Checklist, _React$Component);

  function Checklist(props) {
    _classCallCheck(this, Checklist);

    var _this = _possibleConstructorReturn(this, (Checklist.__proto__ || Object.getPrototypeOf(Checklist)).call(this, props));

    _this.load_checklist = function () {
      var url;
      if (_this.props.type == "planning") {
        url = "../projects/" + _this.props.project_id + "/plan_checklist";
      } else {
        url = "../projects/" + _this.props.project_id + "/wrapup_checklist";
      }
      $.ajax({
        url: url,
        type: "GET",
        context: _this,
        success: function success(checklist_data) {
          console.log(checklist_data);
          this.setState({
            checklist: checklist_data
          });
        }
      });
    };

    _this.get_table_map = function () {
      if (_this.props.type == "planning") {
        return {
          contract_mailed_to_client: "Contract mailed to Client",
          create_endis: "Create project webpage, calendar event, and volunteer schedule in Endis",
          email_req_volunteers_and_register: "Send out initial email requesting volunteers. Register into Website/DB",
          proj_activation_call_client: "Project activation call to client",
          planning_visit: "Planning visit completed",
          create_cost_lists: "Create list of materials, rentals & supplies needed. Send to Darrell",
          verify_site_resources: "Verify site resources needed",
          arranged_purchase_delivery: "Arrange for purchase & delivery of all materials, rentals, supplies, etc.",
          rent_pota_potty: "Rent porta-pottie",
          rent_waste_bin: "Rent waste bin",
          check_weather: "Check the weather forecast and make plans accordingly",
          verify_number_volunteers: "Verify number of volunteers signed up",
          send_final_volunteer_email: "Send final email to signed up volunteers 3-5 days before project",
          send_followup_volunteer_email: "Send follow-up emails to volunteers via Endis as needed"
        };
      } else {
        return {
          return_signup_sheet: "Return volunteer sign-up sheet to office",
          record_volunteer_info: "Record volunteer hours & info",
          schedule_porta_pickup: "Schedule porta potty pickup",
          schedule_waste_pickup: "Schedule waste bin pickup",
          arrange_waste_disposal: "Arrange waste disposal",
          return_materials_rental: "Return materials & rentals",
          turn_receipts_expenses: "Turn in receipts & expenses to office",
          process_reimbursement_checks: "Process reimbursement checks",
          submit_photos: "Submit photos to Flickr or office",
          submit_project_form: "Submit project report to office",
          update_project_webpage: "Update the project webpage",
          call_client: "Call client to see how project went",
          send_volunteer_email: "Send volunteer thank you emails",
          determine_followup: "Determine if followup is needed",
          sending_closing_letter: "Send closing recipient letter"
        };
      }
    };

    _this.onChange_check_input = function (e) {
      var property = e.target.getAttribute("name"),
          index = e.target.getAttribute("index"),
          type = e.target.getAttribute("checklist_type");
      var value = type == "additional" ? !_this.state.checklist.additional_checklist[index].complete : !_this.state.checklist[property].complete;

      $.ajax({
        url: "/app_project/checklist/" + _this.state.checklist._id,
        type: "PATCH",
        data: {
          type: _this.props.type,
          property: property,
          property_type: "property",
          value: value
        },
        context: _this,
        success: function success(data) {
          this.setState(function (state) {
            var new_checklists = Object.assign({}, state.checklist);
            // Check if it's a pre-defined property or an user added one
            if (type == "additional") {
              new_checklists.additional_checklist[index].complete = value;
            } else {
              new_checklists[property].complete = value;
            }
            return {
              checklist: new_checklists
            };
          });
        }
      });
    };

    _this.onChange_owner_select = function (e) {
      var property = e.target.getAttribute("name"),
          value = e.target.value;
      $.ajax({
        url: "/app_project/checklist/" + _this.state.checklist._id,
        type: "PATCH",
        data: {
          type: _this.props.type,
          property: property,
          property_type: "owner",
          value: value
        },
        context: _this,
        success: function success(data) {
          this.setState(function (state) {
            var new_checklists = Object.assign({}, state.checklist);
            if (property in state.checklist) {
              new_checklists[property].owner = value;
            } else {
              for (var i = 0; i < new_checklists.additional_checklist.length; i++) {
                if (new_checklists.additional_checklist[i].name == property) {
                  new_checklists.additional_checklist[i].owner = value;
                  break;
                }
              }
            }
            return {
              checklist: new_checklists
            };
          });
        }
      });
    };

    _this.get_owner = function (key) {
      var checklist = _this.state.checklist;
      if (key in checklist) {
        return key in checklist && "owner" in checklist[key] && checklist[key].owner != null ? checklist[key].owner : "";
      } else if ("additional_checklist" in checklist) {
        for (var i = 0; i < checklist.additional_checklist.length; i++) {
          if (key == checklist.additional_checklist[i].name) {
            return checklist.additional_checklist[i].owner != null ? checklist.additional_checklist[i].owner : "";
          }
        }
      }
      return "";
    };

    _this.get_property = function (key) {
      var checklist = _this.state.checklist;
      if (key in checklist) {
        return checklist[key] ? checklist[key].complete : false;
      } else if (checklist.additional_checklist) {
        for (var i = 0; i < checklist.additional_checklist.length; i++) {
          if (checklist.additional_checklist[i].name == key) {
            return checklist.additional_checklist[i].complete;
          }
        }
      }
      return false;
    };

    _this.onClick_add_checklist = function () {
      var name = window.prompt("Name of item to add to checklist?");
      if (name == null) {
        // cancelled
        return;
      } else if (name && name.length > 4) {
        if (name in _this.state.checklist) {
          window.alert("Checklist item name is already in use.");
          return;
        }
        console.log(_this.table_map);
        var key = void 0;
        for (key in _this.table_map) {
          if (_this.table_map[key] == name) {
            window.alert("Checklist item name is already in use.");
            return;
          }
        }
        for (var i = 0; i < _this.state.checklist.additional_checklist.length; i++) {
          if (name == _this.state.checklist.additional_checklist[i].name) {
            window.alert("Checklist item name is already in use.");
            return;
          }
        }
        $.ajax({
          url: "/app_project/checklist/" + _this.state.checklist._id,
          type: "POST",
          data: {
            type: _this.props.type,
            name: name
          },
          context: _this,
          success: function success(itemData) {
            this.setState(function (state) {
              var new_checklist = Object.assign({}, state.checklist);
              new_checklist.additional_checklist.push(itemData);
              return {
                checklist: new_checklist
              };
            });
          }
        });
      } else {
        window.alert("Please entere something with a lenght of at least 5.");
      }
    };

    _this.onClick_delete_additional_item = function (e) {
      var name = e.target.getAttribute("name");
      var result = window.confirm("Are you sure you want to delete " + name + "?");
      if (!result) {
        return;
      }
      $.ajax({
        url: "/app_project/checklist/" + _this.state.checklist._id,
        type: "DELETE",
        data: {
          type: _this.props.type,
          name: name
        },
        context: _this,
        success: function success() {
          this.setState(function (state) {
            var new_checklist = Object.assign({}, state.checklist);
            var additional_checklist = new_checklist.additional_checklist;

            for (var i = 0; i < additional_checklist.length; i++) {
              if (additional_checklist[i].name == name) {
                additional_checklist.splice(i, 1);
              }
            }
            return { checklist: new_checklist };
          });
        }
      });
    };

    _this.create_additional_items = function () {
      if (_this.state.checklist.additional_checklist) {
        return _this.state.checklist.additional_checklist.map(function (item, index) {
          return _this.create_item_row(item.name, item.name, index, true);
        });
      } else {
        return;
      }
    };

    _this.create_item_row = function (key_name, full_name, index) {
      var canDelete = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var delBtn,
          type = canDelete ? "additional" : "regular";

      if (canDelete) {
        delBtn = React.createElement(
          "button",
          {
            onClick: _this.onClick_delete_additional_item,
            name: key_name, className: "btn btn-sm btn-danger",
            type: "btn" },
          "Delete"
        );
      }
      return React.createElement(
        "tr",
        { key: "row-" + key_name },
        React.createElement(
          "td",
          null,
          full_name,
          " ",
          delBtn
        ),
        React.createElement(
          "td",
          null,
          React.createElement("input", { type: "checkbox", name: key_name,
            checked: _this.get_property(key_name),
            checklist_type: type, index: index,
            onChange: _this.onChange_check_input
          })
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            "select",
            { className: "form-control",
              name: key_name,
              onChange: _this.onChange_owner_select,
              value: _this.get_owner(key_name)
            },
            React.createElement(
              "option",
              { value: "" },
              "Unassigned"
            ),
            _this.props.assignable_users.map(function (user) {
              return React.createElement(
                "option",
                { key: key_name + "-option-" + user.id,
                  value: user.id },
                user.name
              );
            })
          )
        )
      );
    };

    _this.state = {
      checklist: {}
    };
    _this.load_checklist();
    _this.table_map = _this.get_table_map();
    return _this;
  }

  // Maps table rows with the backend data properties
  // Note: uses ES6+ with some order in objects


  _createClass(Checklist, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button", className: "btn btn-sm btn btn-outline-primary",
            onClick: this.onClick_add_checklist },
          "Add to Checklist"
        ),
        React.createElement(
          "table",
          { className: "table table-sm" },
          React.createElement(
            "tbody",
            null,
            Object.keys(this.table_map).map(function (key, index) {
              return _this2.create_item_row(key, _this2.table_map[key], index);
            }),
            this.create_additional_items()
          )
        )
      );
    }
  }]);

  return Checklist;
}(React.Component);