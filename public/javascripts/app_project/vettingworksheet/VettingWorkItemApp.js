var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { VettingWorkItemApp };
import { WorkItem } from "../components/workitem.js";
import { ModalMenu } from "../modalmenu.js";

// props. appId: documentPackage/ application id

var VettingWorkItemApp = function (_React$Component) {
  _inherits(VettingWorkItemApp, _React$Component);

  function VettingWorkItemApp(props) {
    _classCallCheck(this, VettingWorkItemApp);

    var _this = _possibleConstructorReturn(this, (VettingWorkItemApp.__proto__ || Object.getPrototypeOf(VettingWorkItemApp)).call(this, props));

    _this.loadWorkItems = function () {
      $.ajax({
        url: '/app_project/application/' + _this.props.appId + '/workitems',
        type: 'GET',
        context: _this,
        success: function success(workitems) {
          console.log(workitems);
          var completeWorkItems = [],
              currentWorkItems = [],
              declinedWorkItems = [];
          for (var i = 0, workitem; i < workitems.length; i++) {
            workitem = workitems[i];
            // Specified by Dan to show handleit under completed
            if (workitem.status == "accepted" && !workitem.handleit && (workitem.complete || workitem.transferred)) {
              continue;
            }
            if (workitem.status == "declined") {
              declinedWorkItems.push(workitem);
            } else if (workitem.handleit || workitem.status == "complete") {
              completeWorkItems.push(workitem);
            } else {
              currentWorkItems.push(workitem);
            }
          }
          this.setState({
            currentWorkItems: currentWorkItems,
            completeWorkItems: completeWorkItems,
            declinedWorkItems: declinedWorkItems
          }, function () {
            // Temporarily console.log for debugging
            console.log("current", currentWorkItems);
            console.log("complete", completeWorkItems);
            console.log("declined", declinedWorkItems);
          });
        }
      });
    };

    _this.onSubmit_createWorkItem = function (e) {
      e.preventDefault();
      var data = _this.getData();
      data.application_id = _this.props.appId;
      if (!data.handleit) {
        data.type = "assessment";
      }
      $.ajax({
        url: "/app_project/workitems",
        type: "POST",
        data: data,
        context: _this,
        success: function success(workitem) {
          this.clearForm();
          this.setState({
            currentWorkItems: [].concat(_toConsumableArray(this.state.currentWorkItems), [workitem])
          });
        }
      });
    };

    _this.clearForm = function () {
      var form = document.getElementById(_this.formId);
      form.reset();
    };

    _this.getData = function () {
      var data = {};
      var formData = new FormData($("#" + _this.formId)[0]);

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

      data.handleit = data.handleit == "on" ? true : false;
      return data;
    };

    _this.remove_workitem = function (workitem_id) {
      _this.setState(function (state) {
        var new_workitems = [].concat(_toConsumableArray(state.workItems));
        for (var i = 0; i < new_workitems.length; i++) {
          if (new_workitems[i]._id == workitem_id) {
            new_workitems.splice(i, 1);
            break;
          }
        }
        return { currentWorkItems: new_workitems };
      });
    };

    _this.set_create_materialsitem_menu = function (e, materialsitem_handler) {
      var data = {
        workitem_id: e.target.getAttribute("workitem_id")
      };
      _this.modalmenu.current.show_menu("create_materialsitem", funkie.create_materialsitem, data, materialsitem_handler);
    };

    _this.set_edit_workitem_menu = function (data, edit_workitem_handler) {
      _this.modalmenu.current.show_menu("edit_workitem", funkie.edit_workitem, data, edit_workitem_handler, "vetting");
    };

    _this.set_edit_materialisitem_menu = function (old_data, edit_materialsitem_handler) {
      _this.modalmenu.current.show_menu("edit_materialsitem", funkie.edit_materialsitem, old_data, edit_materialsitem_handler // <WorkItem> method
      );
    };

    _this.createWorkItem = function (workItem) {
      return React.createElement(
        "div",
        { className: "panel panel-primary", key: "container-" + workItem._id },
        React.createElement(
          "div",
          { className: "panel-body" },
          React.createElement(WorkItem, { key: workItem._id, page_type: "vetting",
            workitem: workItem,
            remove_workitem: _this.remove_workitem,
            set_edit_materialisitem_menu: _this.set_edit_materialisitem_menu,
            set_create_materialsitem_menu: _this.set_create_materialsitem_menu,
            set_edit_workitem_menu: _this.set_edit_workitem_menu
          })
        )
      );
    };

    _this.createDeclinedWorkItems = function () {
      var workitems = [];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this.state.declinedWorkItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var workItem = _step2.value;

          if (_this.state.showType == "assessment" && workItem.type != "assessment" || _this.state.showType == "project" && workItem.type != "project") {
            continue;
          }
          workitems.push(_this.createWorkItem(workItem));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return workitems;
    };

    _this.createCurrentWorkItems = function () {
      var workitems = [];

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _this.state.currentWorkItems[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var workItem = _step3.value;

          if (_this.state.showType == "assessment" && workItem.type != "assessment" || _this.state.showType == "project" && workItem.type != "project") {
            continue;
          }
          workitems.push(_this.createWorkItem(workItem));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return workitems;
    };

    _this.createCompleteWorkItems = function () {
      var workitems = [];

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _this.state.completeWorkItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var workItem = _step4.value;

          if (_this.state.showType == "assessment" && workItem.type != "assessment" || _this.state.showType == "project" && workItem.type != "project" || workItem.status == "declined") {
            continue;
          }
          workitems.push(React.createElement(
            "div",
            { className: "panel panel-primary", key: workItem._id },
            React.createElement(
              "div",
              { className: "panel-body" },
              React.createElement(WorkItem, { page_type: "vetting",
                workitem: workItem
                // Disabled remove, edit, & create so manually create
              })
            )
          ));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return workitems;
    };

    _this.onClickSetShowType = function (e) {
      var value = e.target.value;
      if (value == "all" || value == "assessment" || value == "project") {
        _this.setState({ showType: value });
      }
    };

    _this.state = {
      currentWorkItems: [],
      completeWorkItems: [],
      declinedWorkItems: [],
      showType: "all" // "all", "assessment", "project"
    };
    _this.assessmentId = null;
    _this.loadWorkItems();
    _this.formId = "workitem-create-form";
    _this.modalmenu = React.createRef();
    return _this;
  }
  /**
   * Creates WorkItem wrapped in a div.
   * @param {WorkItem Data} workItem 
   * @returns <div>
   */


  /**
   * Filter out declined work items and create an array of the incomplete ones.
   * @returns Array of WorkItem elements in div container
   */


  _createClass(VettingWorkItemApp, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            "Work Items"
          ),
          React.createElement(
            "span",
            null,
            "Show Work Items:",
            React.createElement(
              "button",
              { value: "all", className: "btn btn-sm btn-primary",
                onClick: this.onClickSetShowType },
              "Show All"
            ),
            React.createElement(
              "button",
              { value: "assessment", className: "btn btn-sm btn-secondary",
                onClick: this.onClickSetShowType },
              "Assessment Only"
            ),
            React.createElement(
              "button",
              { value: "project", className: "btn btn-sm btn-success",
                onClick: this.onClickSetShowType },
              "Projet Only"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-xs-12 col-sm-6 col-md-3" },
            React.createElement(
              "h3",
              null,
              "Add a Work Item"
            ),
            React.createElement(
              "div",
              { className: "panel panel-primary work-item", name: "new" },
              React.createElement(
                "div",
                { className: "panel-body" },
                React.createElement(
                  "h4",
                  { className: "card-title" },
                  "New Work Item"
                ),
                React.createElement(
                  "form",
                  { onSubmit: this.onSubmit_createWorkItem, id: this.formId },
                  React.createElement(
                    "div",
                    { className: "card-text" },
                    React.createElement(
                      "div",
                      { className: "form-group" },
                      React.createElement(
                        "label",
                        { className: "form-control-label" },
                        "Name*"
                      ),
                      React.createElement("input", { type: "text", className: "form-control", name: "name", required: true })
                    ),
                    React.createElement(
                      "div",
                      { className: "form-group" },
                      React.createElement(
                        "label",
                        { className: "form-control-label" },
                        "Description*"
                      ),
                      React.createElement("textarea", { className: "form-control", name: "description", rows: "3" })
                    ),
                    React.createElement(
                      "div",
                      { className: "form-group" },
                      React.createElement(
                        "label",
                        { className: "form-control-label" },
                        "Vetting Comments*"
                      ),
                      React.createElement("textarea", { className: "form-control", name: "vetting_comments", rows: "3", required: true })
                    ),
                    React.createElement(
                      "div",
                      { className: "form-group" },
                      React.createElement(
                        "label",
                        { className: "form-control-label" },
                        "Handle-it"
                      ),
                      React.createElement("input", { type: "checkbox", name: "handleit", id: "checkbox1", style: { "marginLeft": "10px; !important" } })
                    )
                  ),
                  React.createElement(
                    "button",
                    { type: "submit", className: "btn btn-primary card-link" },
                    "Save"
                  ),
                  React.createElement(
                    "button",
                    { type: "button", className: "btn btn-danger card-link",
                      onClick: this.clearForm },
                    "Clear"
                  )
                )
              )
            )
          ),
          React.createElement(
            "div",
            { className: "col-xs-12 col-sm-6 col-md-9" },
            React.createElement(
              "h3",
              null,
              "Current Work Items"
            ),
            React.createElement(
              "div",
              { id: "workitems-container" },
              this.createCurrentWorkItems()
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-sm-12" },
          React.createElement(
            "h3",
            null,
            "Completed Work Items"
          ),
          React.createElement(
            "div",
            { id: "complete-workitems-container" },
            this.createCompleteWorkItems()
          )
        ),
        React.createElement(
          "div",
          { className: "col-sm-12" },
          React.createElement(
            "h3",
            null,
            "Declined Work Items"
          ),
          React.createElement(
            "div",
            { id: "declined-workitems-container" },
            this.createDeclinedWorkItems()
          )
        ),
        React.createElement(ModalMenu, { ref: this.modalmenu })
      );
    }
  }]);

  return VettingWorkItemApp;
}(React.Component);