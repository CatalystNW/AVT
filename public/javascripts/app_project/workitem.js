var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { WorkItem };

var WorkItem = function (_React$Component) {
  _inherits(WorkItem, _React$Component);

  function WorkItem(props) {
    _classCallCheck(this, WorkItem);

    var _this = _possibleConstructorReturn(this, (WorkItem.__proto__ || Object.getPrototypeOf(WorkItem)).call(this, props));

    _this.set_handleit_handler = function (server_data) {
      _this.setState({
        handleit: server_data.handleit
      });
    };

    _this.onChange_handleit = function (event) {
      if (_this.editable) {
        funkie.edit_workitem({
          workitem_id: event.target.getAttribute("workitem_id"),
          handleit: event.target.checked
        }, null, _this.set_handleit_handler);
      }
    };

    _this.add_item = function (materialsItem_data) {
      _this.setState({
        materialsItems: [materialsItem_data].concat(_toConsumableArray(_this.state.materialsItems))
      });
    };

    _this.onClick_create_item = function (e) {
      _this.props.set_create_materialsitem_menu(e, _this.add_item);
    };

    _this.remove_item = function (materialsItem_id) {
      var mlist = [],
          m = _this.state.materialsItems;
      for (var i = 0; i < m.length; i++) {
        if (m[i]._id != materialsItem_id) mlist.push(Object.assign({}, m[i]));
      }
      _this.setState({ materialsItems: mlist });
    };

    _this.onClick_delete_materialsitem = function (e) {
      e.preventDefault();
      var description = e.target.getAttribute("description"),
          item_id = e.target.getAttribute("item_id");
      var result = window.confirm("Are you sure you want to delete " + description + "?");
      if (result) {
        funkie.delete_materialsitem(item_id, _this.remove_item);
      }
    };

    _this.onClick_edit_material_item = function (e) {
      e.preventDefault();
      var materialsItem_id = e.target.getAttribute("item_id"),
          m = _this.state.materialsItems;
      for (var i = 0; i < m.length; i++) {
        if (m[i]._id == materialsItem_id) {
          _this.props.set_edit_materialisitem_menu(m[i], _this.edit_materialsitem_handler);
          break;
        }
      }
    };

    _this.edit_menu_workitems_handler = function (data) {
      _this.setState(data);
    };

    _this.delete_workitem = function () {
      funkie.delete_workitem({ workitem_id: _this.state._id }, function () {
        _this.props.remove_workitem(_this.state._id);
      });
    };

    _this.onClick_edit_workitem_btn = function () {
      _this.props.set_edit_workitem_menu(_this.state, _this.edit_menu_workitems_handler);
    };

    _this.onClick_del_workitem_btn = function () {
      var result = window.confirm("Are you sure you want to delete " + _this.name + "?");
      if (result) {
        _this.delete_workitem();
      }
    };

    _this.edit_materialsitem_handler = function (materialsItem) {
      var new_itemlist = [],
          id = materialsItem._id,
          itemlist = _this.state.materialsItems;
      for (var i = 0; i < itemlist.length; i++) {
        if (itemlist[i]._id == id) {
          new_itemlist.push(materialsItem);
        } else {
          new_itemlist.push(Object.assign({}, itemlist[i]));
        }
      }
      _this.setState({ materialsItems: new_itemlist });
    };

    _this.create_materialslist = function () {
      var total = 0,
          cost;
      return React.createElement(
        "table",
        { className: "table" },
        React.createElement(
          "thead",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "th",
              { scope: "col", className: "col-sm-5" },
              "Description"
            ),
            React.createElement(
              "th",
              { scope: "col", className: "col-sm-1" },
              "Price"
            ),
            React.createElement(
              "th",
              { scope: "col", className: "col-sm-1" },
              "Count"
            ),
            React.createElement(
              "th",
              { scope: "col", className: "col-sm-3" },
              "Vendor"
            ),
            React.createElement(
              "th",
              { scope: "col", className: "col-sm-2" },
              "Total"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          _this.state.materialsItems.map(function (materialsItem, index) {
            var _React$createElement;

            {
              cost = parseFloat(materialsItem.price) * parseInt(materialsItem.quantity) * 100 / 100;
              total += cost;
            }
            return React.createElement(
              "tr",
              { key: "row" + materialsItem._id },
              React.createElement(
                "td",
                { className: "col-sm-5", key: "desc-" + materialsItem._id },
                materialsItem.description
              ),
              React.createElement(
                "td",
                { className: "col-sm-1", key: "price-" + materialsItem._id },
                materialsItem.price
              ),
              React.createElement(
                "td",
                { className: "col-sm-1", key: "options-" + materialsItem._id },
                materialsItem.quantity
              ),
              React.createElement(
                "td",
                { className: "col-sm-3", key: "vendor-" + materialsItem._id },
                materialsItem.vendor
              ),
              React.createElement(
                "td",
                { className: "col-sm-2", key: "del-" + materialsItem._id },
                _this.editable ? React.createElement(
                  "div",
                  { className: "dropdown" },
                  React.createElement(
                    "button",
                    { className: "btn btn-sm btn-secondary dropdown-toggle", type: "button", "data-toggle": "dropdown" },
                    cost
                  ),
                  React.createElement(
                    "div",
                    { className: "dropdown-menu" },
                    React.createElement(
                      "a",
                      { className: "dropdown-item",
                        description: materialsItem.description,
                        item_id: materialsItem._id,
                        onClick: _this.onClick_delete_materialsitem },
                      "Delete"
                    ),
                    React.createElement(
                      "a",
                      (_React$createElement = { className: "dropdown-item", item_id: materialsItem._id
                      }, _defineProperty(_React$createElement, "item_id", materialsItem._id), _defineProperty(_React$createElement, "onClick", _this.onClick_edit_material_item), _React$createElement),
                      "Edit"
                    )
                  )
                ) : React.createElement(
                  "div",
                  null,
                  cost
                )
              )
            );
          })
        ),
        React.createElement(
          "tfoot",
          null,
          React.createElement(
            "tr",
            null,
            React.createElement(
              "td",
              { className: "col-sm-10", colSpan: "4" },
              "Total"
            ),
            React.createElement(
              "td",
              { className: "col-sm-2" },
              total
            )
          )
        )
      );
    };

    _this.onChange_inputs_timer = function (e) {
      var property_type = e.target.getAttribute("property_type"),
          value = e.target.value;

      clearTimeout(_this[property_type + "_timer"]);

      _this.setState(_defineProperty({}, property_type, value));

      _this[property_type + "_timer"] = setTimeout(function () {
        var data = _defineProperty({
          workitem_id: _this.state._id
        }, property_type, value);
        funkie.edit_workitem(data); // No callback
      }, 1000);
    };

    _this.onChange_workitem_status = function (e) {
      if (!_this.editable) {
        return;
      }
      var that = _this,
          status = e.target.value;
      funkie.edit_workitem({
        workitem_id: _this.state._id,
        status: status
      }, function () {
        that.setState({ status: status });
      });
    };

    _this.state = _this.props.workitem;
    _this.editable = !_this.props.workitem.transferred;
    return _this;
  }
  // Finds the material item in state & then runs edit_materialsitem on it


  // Set timer when text is typed


  _createClass(WorkItem, [{
    key: "render",
    value: function render() {
      var project_comments = this.state.type == "project" ? React.createElement(
        "div",
        null,
        React.createElement(
          "b",
          null,
          "Project Comments"
        ),
        React.createElement(
          "p",
          { className: "card-text" },
          this.state.project_comments
        )
      ) : null;
      return React.createElement(
        "div",
        { className: "card" },
        React.createElement(
          "div",
          { className: "card-body" },
          React.createElement(
            "h5",
            { className: "card-title" },
            this.state.name,
            this.editable ? React.createElement(
              "span",
              null,
              React.createElement(
                "button",
                { type: "button", className: "btn btn-sm btn-secondary",
                  onClick: this.onClick_edit_workitem_btn },
                "Edit"
              ),
              React.createElement(
                "button",
                { type: "button", className: "btn btn-sm btn-warning",
                  onClick: this.onClick_del_workitem_btn },
                "Delete"
              )
            ) : null
          ),
          React.createElement(
            "b",
            null,
            "Description"
          ),
          React.createElement(
            "p",
            { className: "card-text" },
            this.state.description
          ),
          React.createElement(
            "b",
            null,
            "Vetting Comments"
          ),
          React.createElement(
            "p",
            { className: "card-text" },
            this.state.vetting_comments
          ),
          React.createElement(
            "b",
            null,
            "Assessment Comments"
          ),
          React.createElement(
            "p",
            { className: "card-text" },
            this.state.assessment_comments
          ),
          project_comments,
          React.createElement(
            "p",
            { className: "card-text" },
            React.createElement(
              "b",
              null,
              "Handle-It "
            ),
            React.createElement("input", { type: "checkbox", name: "handleit",
              checked: this.state.handleit,
              workitem_id: this.state._id,
              onChange: this.onChange_handleit })
          ),
          React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
              "label",
              { className: "col-sm-4 col-form-label",
                htmlFor: "workitem-status-select" },
              "Status"
            ),
            React.createElement(
              "div",
              { className: "col-sm-8" },
              React.createElement(
                "select",
                { className: "form-control", value: this.state.status,
                  id: "workitem-status-select",
                  onChange: this.onChange_workitem_status
                },
                React.createElement(
                  "option",
                  { value: "to_review" },
                  "To Review"
                ),
                React.createElement(
                  "option",
                  { value: "handleit" },
                  "Handleit"
                ),
                React.createElement(
                  "option",
                  { value: "declined" },
                  "Declined"
                ),
                React.createElement(
                  "option",
                  { value: "accepted" },
                  "Accepted"
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "form-group row" },
            React.createElement(
              "label",
              { className: "col-sm-4 col-form-label",
                htmlFor: "workitem-status-select" },
              "Volunteers Required"
            ),
            React.createElement(
              "div",
              { className: "col-sm-8" },
              this.editable ? React.createElement("input", { type: "number", className: "form-control",
                name: "volunteers_required",
                property_type: "volunteers_required",
                onChange: this.onChange_inputs_timer,
                value: this.state.volunteers_required }) : this.state.volunteers_required
            )
          ),
          React.createElement(
            "b",
            null,
            "Materials List"
          ),
          this.editable ? React.createElement(
            "button",
            { type: "button", className: "btn btn-primary btn-sm",
              onClick: this.onClick_create_item,
              workitem_id: this.state._id },
            "+ Item"
          ) : null,
          this.create_materialslist()
        )
      );
    }
  }]);

  return WorkItem;
}(React.Component);