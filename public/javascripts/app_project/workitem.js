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
      // if (this.editable) {
      //   funkie.edit_workitem({
      //     workitem_id: event.target.getAttribute("workitem_id"),
      //     handleit: event.target.checked,
      //   }, null, this.set_handleit_handler);
      // }
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
              { scope: "col", className: "col-sm-4" },
              "Description"
            ),
            React.createElement(
              "th",
              { scope: "col", className: "col-sm-3" },
              "Vendor"
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
              { scope: "col", className: "col-sm-1" },
              "Total"
            ),
            React.createElement(
              "th",
              { scope: "col", className: "col-sm-2" },
              "Options"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          _this.state.materialsItems.map(function (materialsItem, index) {
            cost = parseFloat(materialsItem.price) * parseInt(materialsItem.quantity) * 100 / 100;
            total += cost;
            return React.createElement(
              "tr",
              { key: materialsItem._id },
              React.createElement(
                "td",
                { className: "col-sm-4" },
                materialsItem.description
              ),
              React.createElement(
                "td",
                { className: "col-sm-3" },
                materialsItem.vendor
              ),
              React.createElement(
                "td",
                { className: "col-sm-1" },
                materialsItem.price
              ),
              React.createElement(
                "td",
                { className: "col-sm-1" },
                materialsItem.quantity
              ),
              React.createElement(
                "td",
                { className: "col-sm-1" },
                cost
              ),
              React.createElement(
                "td",
                { className: "col-sm-2" },
                React.createElement(
                  "button",
                  { className: "btn btn-secondary btn-sm",
                    onClick: _this.onClick_edit_material_item,
                    item_id: materialsItem._id },
                  React.createElement(
                    "svg",
                    { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-pencil", viewBox: "0 0 16 16" },
                    React.createElement("path", { d: "M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" })
                  )
                ),
                React.createElement(
                  "button",
                  { className: "btn btn-outline-danger btn-sm",
                    description: materialsItem.description,
                    item_id: materialsItem._id,
                    onClick: _this.onClick_delete_materialsitem },
                  React.createElement(
                    "svg",
                    { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "currentColor", className: "bi bi-trash", viewBox: "0 0 16 16" },
                    React.createElement("path", { d: "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" }),
                    React.createElement("path", { "fill-rule": "evenodd", d: "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" })
                  )
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
      // Show project comments only on project page
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
          this.state.project_comments && this.state.project_comments.length > 0 ? this.state.project_comments : "N/A"
        )
      ) : null;
      var statuses = void 0;
      var id = this.state._id;
      if (this.props.page_type == "project") {
        statuses = [React.createElement(
          "option",
          { key: id + "review", value: "to_review" },
          "To Review"
        ), React.createElement(
          "option",
          { key: id + "progress", value: "in_progress" },
          "In Progress"
        ), React.createElement(
          "option",
          { key: id + "complete", value: "complete" },
          "Complete"
        )];
      } else {
        statuses = [React.createElement(
          "option",
          { key: id + "to_review", value: "to_review" },
          "To Review"
        ), React.createElement(
          "option",
          { key: id + "declined", value: "declined" },
          "Declined"
        ), React.createElement(
          "option",
          { key: id + "accepted", value: "accepted" },
          "Accepted"
        )];
      }
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
              { style: { marginLeft: "15px" } },
              React.createElement(
                "button",
                { type: "button", className: "btn btn-sm btn-secondary",
                  onClick: this.onClick_edit_workitem_btn },
                "Edit"
              ),
              React.createElement(
                "button",
                { type: "button", className: "btn btn-sm btn-danger",
                  onClick: this.onClick_del_workitem_btn },
                "Delete"
              )
            ) : null
          ),
          React.createElement(
            "p",
            null,
            this.state.createdAt.replace(/T.+/, "")
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
            this.state.vetting_comments && this.state.vetting_comments.length > 0 ? this.state.vetting_comments : "N/A"
          ),
          React.createElement(
            "b",
            null,
            "Assessment Comments"
          ),
          React.createElement(
            "p",
            { className: "card-text" },
            this.state.assessment_comments && this.state.assessment_comments.length > 0 ? this.state.assessment_comments : "N/A"
          ),
          project_comments,
          React.createElement(
            "div",
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
              "div",
              { className: "col-md-6 col-sm-12" },
              React.createElement(
                "label",
                { className: "col-6 col-form-label",
                  htmlFor: "workitem-status-select" },
                React.createElement(
                  "b",
                  null,
                  "Status"
                )
              ),
              React.createElement(
                "div",
                { className: "col-6" },
                React.createElement(
                  "select",
                  { className: "form-control", value: this.state.status,
                    id: "workitem-status-select", disabled: this.state.handleit == true,
                    onChange: this.onChange_workitem_status },
                  statuses
                )
              )
            ),
            React.createElement(
              "div",
              { className: "col-md-6 col-sm-12" },
              React.createElement(
                "label",
                { className: "col-6 col-form-label",
                  htmlFor: "workitem-status-select" },
                React.createElement(
                  "b",
                  null,
                  "Volunteers Required"
                )
              ),
              React.createElement(
                "div",
                { className: "col-6" },
                this.editable ? React.createElement("input", { type: "number", className: "form-control",
                  name: "volunteers_required",
                  property_type: "volunteers_required",
                  onChange: this.onChange_inputs_timer,
                  value: this.state.volunteers_required }) : this.state.volunteers_required
              )
            )
          ),
          React.createElement(
            "div",
            { style: { display: "flex" } },
            React.createElement(
              "div",
              null,
              React.createElement(
                "b",
                null,
                "Materials List"
              )
            ),
            React.createElement(
              "div",
              { style: { marginLeft: "15px" } },
              this.editable ? React.createElement(
                "button",
                { type: "button", className: "btn btn-primary btn-sm",
                  onClick: this.onClick_create_item,
                  workitem_id: this.state._id },
                "+ Item"
              ) : null
            )
          ),
          this.create_materialslist()
        )
      );
    }
  }]);

  return WorkItem;
}(React.Component);