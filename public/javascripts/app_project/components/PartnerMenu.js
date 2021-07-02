var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { PartnerMenu };

/**
 * Required Props: 
 *  type ("project" or "siteAssessment")
 *  assessment_id/project_id
 *  getModalMenu - function to get ModalMenu reference
 *  partners - list of partner data belong to project/assessment
 */

var PartnerMenu = function (_React$Component) {
  _inherits(PartnerMenu, _React$Component);

  function PartnerMenu(props) {
    _classCallCheck(this, PartnerMenu);

    var _this = _possibleConstructorReturn(this, (PartnerMenu.__proto__ || Object.getPrototypeOf(PartnerMenu)).call(this, props));

    _this.loadAllPartners = function () {
      $.ajax({
        url: "/app_project/partners",
        type: "GET",
        context: _this,
        success: function success(partnersData) {
          console.log(partnersData);

          // Set checkedId_AllPartners to true/false if selected
          var selectedPartners = this.state.partners;
          var partnerSet = new Set();
          for (var i = 0; i < selectedPartners.length; i++) {
            partnerSet.add(selectedPartners[i]._id);
          }
          var checkedId_AllPartners = partnersData.map(function (partner) {
            return partnerSet.has(partner._id);
          });

          this.setState({
            allPartners: partnersData,
            checkedId_AllPartners: checkedId_AllPartners
          });
        }
      });
    };

    _this.change_status = function () {
      var new_status = _this.state.status == "show_current_partners" ? "show_all_partners" : "show_current_partners";
      if (new_status == "show_all_partners") {
        _this.loadAllPartners();
      }
      _this.setState({
        status: new_status
      });
    };

    _this.submitSelectedPartners = function () {
      var inputs = document.querySelectorAll("input[name=partnerId]:checked");
      var selectedPartners = [],
          selectedPartnerIds = [],
          checkedId_AllPartners = _this.state.allPartners.map(function () {
        return false;
      });
      var id = void 0,
          index = void 0;
      for (var i = 0; i < inputs.length; i++) {
        id = inputs[i].value;
        index = inputs[i].getAttribute("index");
        selectedPartners.push(_this.state.allPartners[index]);
        selectedPartnerIds.push(_this.state.allPartners[index]._id);
        checkedId_AllPartners[index] = true;
      }

      var url = void 0;
      if (_this.props.type == "project") {
        url = "/app_project/projects/" + _this.props.project_id + "/partners";
      } else {
        url = "/app_project/site_assessments/" + _this.props.assessment_id + "/partners";
      }
      $.ajax({
        url: url,
        type: "PATCH",
        data: {
          selectedPartnerIds: selectedPartnerIds
        },
        context: _this,
        success: function success(data) {
          this.setState({
            partners: selectedPartners,
            checkedId_AllPartners: checkedId_AllPartners
          });
        }
      });

      _this.change_status();
    };

    _this.onClickViewPartner = function (e) {
      var index = e.target.getAttribute("index"),
          location = e.target.getAttribute("location");
      var data = _this.state[location][index];
      _this.props.getModalMenu().show_menu("view_partner", null, data, null);
    };

    _this.onClick_editPartner = function (e) {
      var partner_id = e.target.getAttribute("partner_id"),
          index = e.target.getAttribute("index"),
          location = e.target.getAttribute("location");
      var data = _this.state[location][index];
      data.type = "project";
      data.partner_id = data._id;

      _this.props.getModalMenu().show_menu("edit_partner", funkie.edit_partner, data, function (newPartnerData) {
        if (newPartnerData == null) {
          return;
        }
        _this.setState(function (state) {
          var new_allPartners = [].concat(_toConsumableArray(state.allPartners));
          var new_partners = [].concat(_toConsumableArray(state.partners));
          var i = void 0;
          for (i = 0; i < new_allPartners.length; i++) {
            if (new_allPartners[i]._id == partner_id) {
              new_allPartners[i] = newPartnerData;
              break;
            }
          }
          for (i = 0; i < new_partners.length; i++) {
            if (new_partners[i]._id == partner_id) {
              new_partners[i] = newPartnerData;
              break;
            }
          }
          return {
            allPartners: new_allPartners,
            partners: new_partners
          };
        });
      });
    };

    _this.onClick_createPartner = function () {
      _this.props.getModalMenu().show_menu("create_partner", funkie.create_partner, {}, function (createdPartner) {
        _this.setState(function (state) {
          var new_allPartners = [].concat(_toConsumableArray(state.allPartners), [createdPartner]);
          var new_checkedId = [].concat(_toConsumableArray(state.checkedId_AllPartners), [true]);
          return {
            allPartners: new_allPartners,
            checkedId_AllPartners: new_checkedId
          };
        });
      });
    };

    _this.onClick_deletePartner = function (e) {
      var partner_id = e.target.getAttribute("partner_id"),
          index = e.target.getAttribute("index"),
          location = e.target.getAttribute("location");
      var confirm = window.confirm("Are you sure you want to delete " + _this.state[location][index].org_name + "?");
      if (confirm) {
        $.ajax({
          url: "/app_project/partners/" + partner_id,
          type: "DELETE",
          context: _this,
          success: function success() {
            // Deletes partners if selected & from all partners list
            this.setState(function (state) {
              var new_allPartners = [].concat(_toConsumableArray(state.allPartners));
              var new_checkedId = [].concat(_toConsumableArray(state.checkedId_AllPartners));
              var new_partners = [].concat(_toConsumableArray(state.partners));
              var i = void 0;
              for (i = 0; i < new_allPartners.length; i++) {
                if (new_allPartners[i]._id == partner_id) {
                  new_allPartners.splice(i, 1);
                  new_checkedId.splice(i, 1);
                  break;
                }
              }
              for (i = 0; i < new_partners.length; i++) {
                if (new_partners[i]._id == partner_id) {
                  new_partners.splice(i, 1);
                  break;
                }
              }
              return {
                allPartners: new_allPartners,
                checkedId_AllPartners: new_checkedId,
                partners: new_partners
              };
            });
          }
        });
      }
    };

    _this.selectRow = function (e) {
      if (e.target.tagName == "BUTTON") {
        return;
      }

      var element = e.target;
      for (var i = 0; i < 5; i++) {
        // Limit search to 5 elements
        if (element.tagName == "TR") {
          break;
        }
        element = element.parentNode;
      }
      var index = element.getAttribute("index");
      _this.setState(function (state) {
        var new_checkedId_AllPartners = [].concat(_toConsumableArray(state.checkedId_AllPartners));
        new_checkedId_AllPartners[index] = !state.checkedId_AllPartners[index];
        return { checkedId_AllPartners: new_checkedId_AllPartners };
      });
    };

    _this.show_current_partners = function () {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button", className: "btn btn-primary",
            onClick: _this.change_status },
          "Modify Partners"
        ),
        React.createElement(
          "h3",
          null,
          "Current Partners"
        ),
        React.createElement(
          "table",
          { className: "table table-sm" },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { scope: "col" },
                "Name"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Contact"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Phone"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Email"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Options"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            _this.state.partners.map(function (partner, index) {
              return React.createElement(
                "tr",
                { key: "current-" + partner._id },
                React.createElement(
                  "td",
                  null,
                  partner.org_name
                ),
                React.createElement(
                  "td",
                  null,
                  partner.contact_name
                ),
                React.createElement(
                  "td",
                  null,
                  partner.contact_phone
                ),
                React.createElement(
                  "td",
                  null,
                  partner.contact_email
                ),
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "button",
                    { type: "button", className: "btn btn-sm btn-primary",
                      location: "partners",
                      partner_id: partner._id, index: index,
                      onClick: _this.onClickViewPartner },
                    "View"
                  ),
                  React.createElement(
                    "button",
                    { type: "button", className: "btn btn-sm",
                      location: "partners",
                      partner_id: partner._id, index: index,
                      onClick: _this.onClick_editPartner },
                    "Edit"
                  )
                )
              );
            })
          )
        )
      );
    };

    _this.show_all_partners = function () {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { type: "button", className: "btn btn-primary",
            onClick: _this.submitSelectedPartners },
          "Submit"
        ),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-warning",
            onClick: _this.change_status },
          "Cancel"
        ),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-success",
            onClick: _this.onClick_createPartner },
          "Create Partner"
        ),
        React.createElement(
          "h3",
          null,
          "Available Partners"
        ),
        React.createElement(
          "table",
          { className: "table table-sm" },
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", { scope: "col" }),
              React.createElement(
                "th",
                { scope: "col" },
                "Name"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Contact"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Phone"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Email"
              ),
              React.createElement(
                "th",
                { scope: "col" },
                "Options"
              )
            )
          ),
          React.createElement(
            "tbody",
            null,
            _this.state.allPartners.map(function (partner, index) {
              return React.createElement(
                "tr",
                { key: "all-" + partner._id, index: index, onClick: _this.selectRow },
                React.createElement(
                  "td",
                  null,
                  React.createElement("input", { type: "checkbox", index: index,
                    value: partner._id, name: "partnerId",
                    readOnly: true,
                    checked: _this.state.checkedId_AllPartners[index]
                  })
                ),
                React.createElement(
                  "td",
                  null,
                  partner.org_name
                ),
                React.createElement(
                  "td",
                  null,
                  partner.contact_name
                ),
                React.createElement(
                  "td",
                  null,
                  partner.contact_phone
                ),
                React.createElement(
                  "td",
                  null,
                  partner.contact_email
                ),
                React.createElement(
                  "td",
                  null,
                  React.createElement(
                    "button",
                    { type: "button", className: "btn btn-sm btn-primary",
                      location: "allPartners",
                      partner_id: partner._id, index: index,
                      onClick: _this.onClickViewPartner },
                    "View"
                  ),
                  React.createElement(
                    "button",
                    { type: "button", className: "btn btn-sm btn-secondary",
                      location: "allPartners",
                      partner_id: partner._id, index: index,
                      onClick: _this.onClick_editPartner },
                    "Edit"
                  ),
                  React.createElement(
                    "button",
                    { type: "button", className: "btn btn-sm btn-danger",
                      location: "allPartners",
                      partner_id: partner._id, index: index,
                      onClick: _this.onClick_deletePartner },
                    "Delete"
                  )
                )
              );
            })
          )
        )
      );
    };

    _this.state = {
      partners: _this.props.partners, // partners selected
      allPartners: [],
      checkedId_AllPartners: [],
      status: "show_current_partners"
    };
    return _this;
  }

  // Changes status to showing current partners / selecting new partners


  // Add selected partners to assessment/ project


  _createClass(PartnerMenu, [{
    key: "render",
    value: function render() {
      if (this.state.status == "show_all_partners") {
        return this.show_all_partners();
      } else {
        return this.show_current_partners();
      }
    }
  }]);

  return PartnerMenu;
}(React.Component);