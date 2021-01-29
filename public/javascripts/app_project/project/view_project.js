var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectApp = function (_React$Component) {
  _inherits(ProjectApp, _React$Component);

  function ProjectApp(props) {
    _classCallCheck(this, ProjectApp);

    var _this = _possibleConstructorReturn(this, (ProjectApp.__proto__ || Object.getPrototypeOf(ProjectApp)).call(this, props));

    _this.set_create_workitem_menu = function () {
      var data = {
        project_id: _this.state.project._id,
        type: "project",
        application_id: _this.state.application.id
      };
      _this.modalmenu.current.show_menu("create_workitem", funkie.create_workitem, data, _this.project_menu.current.add_workitem);
    };

    _this.set_edit_materialisitem_menu = function (old_data, edit_materialsitem_handler) {
      _this.modalmenu.current.show_menu("edit_materialsitem", funkie.edit_materialsitem, old_data, edit_materialsitem_handler // <WorkItem> method
      );
    };

    _this.set_create_materialsitem_menu = function (e, materialsitem_handler) {
      var data = {
        workitem_id: e.target.getAttribute("workitem_id")
      };
      _this.modalmenu.current.show_menu("create_materialsitem", funkie.create_materialsitem, data, materialsitem_handler);
    };

    _this.set_edit_workitem_menu = function (data, edit_workitem_handler) {
      _this.modalmenu.current.show_menu("edit_workitem", funkie.edit_workitem, data, edit_workitem_handler);
    };

    _this.state = {
      project: null,
      application: null
    };
    _this.load_project();
    _this.project_menu = React.createRef();
    _this.modalmenu = React.createRef();
    return _this;
  }

  _createClass(ProjectApp, [{
    key: "load_project",
    value: function load_project() {
      if (project_id) {
        $.ajax({
          url: "/app_project/projects/" + project_id,
          type: "GET",
          context: this,
          success: function success(project_data) {
            var _this2 = this;

            console.log(project_data);
            this.project_menu.current.load_project(project_data);
            this.setState({
              project: project_data
            }, function () {
              _this2.load_application_data(project_data.documentPackage);
            });
          }
        });
      }
    }
  }, {
    key: "load_application_data",
    value: function load_application_data(documentPackage_id) {
      $.ajax({
        url: "/app_project/application/" + documentPackage_id,
        type: "GET",
        context: this,
        success: function success(app_data) {
          console.log(app_data);
          this.setState({ application: app_data });
        }
      });
    }

    // materialsitem_handler handles showing the element

  }, {
    key: "render",
    value: function render() {
      var assessment_id;
      if (this.state.project) {
        assessment_id = this.state.project.siteAssessment;
      }
      return React.createElement(
        "div",
        null,
        React.createElement(ProjectMenu, { ref: this.project_menu,
          set_create_workitem_menu: this.set_create_workitem_menu,
          set_create_materialsitem_menu: this.set_create_materialsitem_menu,
          set_edit_materialisitem_menu: this.set_edit_materialisitem_menu,
          set_edit_workitem_menu: this.set_edit_workitem_menu
        }),
        React.createElement(ApplicationInformation, {
          application: this.state.application,
          view_type: "project", assessment_id: assessment_id
        }),
        React.createElement(ModalMenu, { ref: this.modalmenu })
      );
    }
  }]);

  return ProjectApp;
}(React.Component);

/**
 * Requires props.set_create_workitem_menu(),
 */


var ProjectMenu = function (_React$Component2) {
  _inherits(ProjectMenu, _React$Component2);

  function ProjectMenu(props) {
    _classCallCheck(this, ProjectMenu);

    var _this3 = _possibleConstructorReturn(this, (ProjectMenu.__proto__ || Object.getPrototypeOf(ProjectMenu)).call(this, props));

    _this3.load_assignable_users = function () {
      $.ajax({
        url: "/app_project/projects/assignable_users",
        type: "GET",
        context: _this3,
        success: function success(users) {
          this.setState({
            assignable_users: users
          });
        }
      });
    };

    _this3.add_workitem = function (workitem) {
      _this3.setState({
        workItems: [workitem].concat(_toConsumableArray(_this3.state.workItems))
      });
    };

    _this3.remove_workitem = function (workitem_id) {
      var new_workitems = [];
      for (var i = 0; i < _this3.state.workItems.length; i++) {
        if (_this3.state.workItems[i]._id != workitem_id) {
          new_workitems.push(_this3.state.workItems[i]);
        }
      }
      _this3.setState({
        workItems: new_workitems
      });
    };

    _this3.onChange_date_callback = function (data) {
      data.property = data.date_type;
      $.ajax({
        url: "/app_project/projects/" + _this3.state._id,
        type: "PATCH",
        data: data,
        context: _this3
      });
    };

    _this3.onChange_inputs_timer = function (e) {
      var property_type = e.target.getAttribute("property_type"),
          value = e.target.value;
      clearTimeout(_this3[property_type + "_timer"]);

      _this3.setState(_defineProperty({}, property_type, value));

      _this3[property_type + "_timer"] = setTimeout(function () {
        var data = {
          property: property_type,
          value: value
        };
        $.ajax({
          url: "/app_project/projects/" + _this3.state._id,
          type: "PATCH",
          data: data,
          context: _this3
        });
      }, 700);
    };

    _this3.state = { // Project data saved directly to state
      workItems: [],
      assignable_users: [],
      volunteer_hours: 0,
      site_host: "",
      crew_chief: "",
      project_advocate: ""
    };
    _this3.load_assignable_users();
    _this3.planning_checklist = React.createRef();
    _this3.wrapup_checklist = React.createRef();
    _this3.costsummary = React.createRef();

    _this3.volunteer_hours_timer = null;
    _this3.site_host_timer = null;
    _this3.crew_chief_timer = null;
    _this3.project_advocate_timer = null;
    return _this3;
  }

  _createClass(ProjectMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var that = this;
      // Tab changed. Newer versions of Bootstrap has a slight change in this
      // Load data when cost-summary is shown
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        if (e.target.id == "nav-cost-summary-tab") {
          that.costsummary.current.load_data("project", project_id);
        }
      });
      $("#nav-project-tabContent").css("padding-top", $("#project-nav-container").height());
      $("#project-nav-container").css("width", $("#nav-project-tabContent").width());
    }
  }, {
    key: "load_project",
    value: function load_project(project_data) {
      this.setState(function (state) {
        return Object.assign({}, state, project_data);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var divStyle = {
        height: funkie.calculate_page_height().toString() + "px"
      };
      return React.createElement(
        "div",
        { className: "col-sm-12 col-lg-8", style: divStyle,
          id: "assessment-container" },
        React.createElement(
          "div",
          { id: "project-nav-container" },
          React.createElement(
            "ul",
            { className: "nav nav-tabs", id: "nav-assessment-tabs", role: "tablist" },
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link active", id: "nav-info-tab", "data-toggle": "tab",
                  href: "#nav-info", role: "tab" },
                "Info"
              )
            ),
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link", id: "nav-property-tab", "data-toggle": "tab",
                  href: "#nav-workitem", role: "tab" },
                "Work Items"
              )
            ),
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link", id: "nav-cost-summary-tab", "data-toggle": "tab",
                  href: "#nav-cost-summary", role: "tab" },
                "Cost Summary"
              )
            ),
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link", id: "nav-planning-tab", "data-toggle": "tab",
                  href: "#nav-planning", role: "tab" },
                "Planning"
              )
            ),
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link", id: "nav-partners-tab", "data-toggle": "tab",
                  href: "#nav-partners", role: "tab" },
                "Partners"
              )
            ),
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link", id: "nav-wrapup-tab", "data-toggle": "tab",
                  href: "#nav-wrapup", role: "tab" },
                "Wrap-Up"
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "tab-content overflow-auto", id: "nav-project-tabContent" },
          React.createElement(
            "div",
            { className: "tab-pane show active", id: "nav-info", role: "tabpanel" },
            this.state.start ? React.createElement(DateMenuRow, { title: "Start Date",
              date_type: "project_start_date",
              date: this.state.start,
              change_callback: this.onChange_date_callback
            }) : React.createElement("div", null),
            this.state.end ? React.createElement(DateMenuRow, { title: "End Date",
              date_type: "project_end_date",
              date: this.state.end,
              change_callback: this.onChange_date_callback
            }) : React.createElement("div", null),
            React.createElement(
              "div",
              { className: "form-group row" },
              React.createElement(
                "label",
                { className: "col-sm-4 col-form-label" },
                "Volunteer Hours"
              ),
              React.createElement(
                "div",
                { className: "col-sm-4" },
                React.createElement("input", { type: "number", className: "form-control",
                  property_type: "volunteer_hours",
                  onChange: this.onChange_inputs_timer,
                  value: this.state.volunteer_hours })
              )
            ),
            React.createElement(
              "h2",
              null,
              "Leaders"
            ),
            React.createElement(
              "div",
              { className: "form-group row" },
              React.createElement(
                "label",
                { className: "col-sm-4 col-form-label" },
                "Crew Chief"
              ),
              React.createElement(
                "div",
                { className: "col-sm-4" },
                React.createElement("input", { type: "type", className: "form-control",
                  property_type: "crew_chief",
                  onChange: this.onChange_inputs_timer,
                  value: this.state.crew_chief })
              )
            ),
            React.createElement(
              "div",
              { className: "form-group row" },
              React.createElement(
                "label",
                { className: "col-sm-4 col-form-label" },
                "Project Advocate"
              ),
              React.createElement(
                "div",
                { className: "col-sm-4" },
                React.createElement("input", { type: "type", className: "form-control",
                  property_type: "project_advocate",
                  onChange: this.onChange_inputs_timer,
                  value: this.state.project_advocate })
              )
            ),
            React.createElement(
              "div",
              { className: "form-group row" },
              React.createElement(
                "label",
                { className: "col-sm-4 col-form-label" },
                "Site Host"
              ),
              React.createElement(
                "div",
                { className: "col-sm-4" },
                React.createElement("input", { type: "type", className: "form-control",
                  property_type: "site_host",
                  onChange: this.onChange_inputs_timer,
                  value: this.state.site_host })
              )
            )
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-cost-summary", role: "tabpanel" },
            React.createElement(CostSummary, { ref: this.costsummary })
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-partners", role: "tabpanel" },
            "Partners"
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-planning", role: "tabpanel" },
            React.createElement(Checklist, { ref: this.planning_checklist,
              type: "planning",
              assignable_users: this.state.assignable_users,
              project_id: project_id })
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-wrapup", role: "tabpanel" },
            React.createElement(Checklist, { ref: this.planning_checklist,
              type: "wrapup",
              assignable_users: this.state.assignable_users,
              project_id: project_id })
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-workitem", role: "tabpanel" },
            React.createElement(
              "button",
              { type: "button", className: "btn btn-primary",
                onClick: this.props.set_create_workitem_menu
              },
              "Create Work Item"
            ),
            React.createElement(
              "div",
              null,
              this.state.workItems.map(function (workitem, index) {
                return React.createElement(WorkItem, {
                  workitem: workitem,
                  remove_workitem: _this4.remove_workitem,
                  set_edit_materialisitem_menu: _this4.props.set_edit_materialisitem_menu,
                  set_create_materialsitem_menu: _this4.props.set_create_materialsitem_menu,
                  set_edit_workitem_menu: _this4.props.set_edit_workitem_menu,
                  key: workitem._id + "-workitem-card"
                });
              })
            )
          )
        )
      );
    }
  }]);

  return ProjectMenu;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(ProjectApp, null), document.getElementById("project_container"));
}

loadReact();