var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectTransferApp = function (_React$Component) {
  _inherits(ProjectTransferApp, _React$Component);

  function ProjectTransferApp(props) {
    _classCallCheck(this, ProjectTransferApp);

    var _this = _possibleConstructorReturn(this, (ProjectTransferApp.__proto__ || Object.getPrototypeOf(ProjectTransferApp)).call(this, props));

    _this.load_assessment = function () {
      var that = _this;
      $.ajax({
        url: "app_project/site_assessment/" + _this.state.assessment_id,
        method: "GET",
        success: function success(data) {
          console.log(data);
          var handleit_workitems = [],
              proj_workitems = [],
              workitem;
          for (var i = 0; i < data.workItems.length; i++) {
            workitem = data.workItems[i];
            if (workitem.status == "accepted") {
              if (workitem.handleit) {
                handleit_workitems.push(workitem);
              } else {
                workitem.project = "";
                proj_workitems.push(workitem);
              }
            }
          }

          that.setState({
            handleit_workitems: handleit_workitems,
            proj_workitems: proj_workitems
          });
        }
      });
    };

    _this.onChange_project_select = function (e) {
      var id = e.target.getAttribute("workitem_id");
      for (var i = 0; i < _this.state.proj_workitems.length; i++) {
        if (id == _this.state.proj_workitems[i]._id) {
          _this.setState(function (prev_state) {
            prev_state.proj_workitems[i].project = e.target.value;
            return { project_workitems: prev_state.project_workitems };
          });
          break;
        }
      }
    };

    _this.create_project_options = function (handleit, workitem) {
      if (handleit) {
        return React.createElement(
          "td",
          null,
          workitem.name
        );
      } else {
        return React.createElement(
          "td",
          null,
          React.createElement(
            "select",
            { className: _this.project_select_class,
              workitem_id: workitem._id,
              value: workitem.project,
              onChange: _this.onChange_project_select },
            _this.state.projects.map(function (project, index) {
              return React.createElement(
                "option",
                { key: workitem._id + "-proj-" + index },
                project
              );
            })
          )
        );
      }
    };

    _this.create_workItems = function (handleit) {
      var workitems = handleit ? _this.state.handleit_workitems : _this.state.proj_workitems,
          keyname = handleit ? "h-wi-" : "p-wi-";
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
              { scope: "col" },
              "Name"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Description"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Project Name"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          workitems.map(function (workitem) {
            return React.createElement(
              "tr",
              { key: keyname + workitem._id },
              React.createElement(
                "td",
                null,
                workitem.name
              ),
              React.createElement(
                "td",
                null,
                workitem.description
              ),
              _this.create_project_options(handleit, workitem)
            );
          })
        )
      );
    };

    _this.onClick_create_project = function () {
      var name = window.prompt("Project Name");
      if (name != null && name.length > 0) {
        // Check if the project name already exists
        for (var i = 0; i < _this.state.projects.length; i++) {
          if (_this.state.projects[i] === name) {
            window.alert("A project already exists with this name");
            return;
          }
        }

        _this.setState({
          projects: [].concat(_toConsumableArray(_this.state.projects), [name])
        }, function () {
          // Assign project to workitems if it's the first one
          if (_this.state.projects.length == 1) {
            for (var i = 0; i < _this.state.proj_workitems.length; i++) {
              _this.state.proj_workitems[i].project = name;
            }
          }
        });
      }
    };

    _this.transfer_project = function () {
      var handleitWorkitemObj = {},
          projWorkItemObj = {},
          i;
      // Get handleit workitems
      for (i = 0; i < _this.state.handleit_workitems.length; i++) {
        handleitWorkitemObj[_this.state.handleit_workitems[i]._id] = _this.state.handleit_workitems[i].name;
      }
      // Get project workitems
      for (i = 0; i < _this.state.proj_workitems.length; i++) {
        if (_this.state.proj_workitems[i].project == null || _this.state.proj_workitems[i].project.length === 0) {
          window.alert("Work item " + _this.state.proj_workitems[i].name + "\n            does not have a project name assigned to it.");
          return;
        }

        projWorkItemObj[_this.state.proj_workitems[i]._id] = _this.state.proj_workitems[i].project;
      }
      $.ajax({
        url: "../project_transfer/" + _this.state.assessment_id,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          project_workitems: projWorkItemObj,
          handleit_workitems: handleitWorkitemObj
        }),
        success: function success(data) {
          console.log("transfer");
        }
      });
    };

    _this.onClick_transfer = function () {
      if (_this.state.projects.length > 0) {
        var result = window.confirm("Are you sure you want to transfer?");
        if (result) {
          _this.transfer_project();
        }
      } else {
        window.alert("There are work items not assigned to a project");
      }
    };

    _this.state = {
      assessment_id: assessment_id,
      handleit_workitems: [],
      proj_workitems: [],
      projects: []
    };
    _this.project_select_class = "project-select";
    _this.load_assessment();
    return _this;
  }

  // Creates the select & option elements for the project options


  _createClass(ProjectTransferApp, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          { className: "btn btn-sm btn-outline-primary", type: "button",
            onClick: this.onClick_transfer },
          "Transfer"
        ),
        React.createElement(
          "button",
          { className: "btn btn-sm btn-outline-info", type: "button",
            onClick: this.onClick_create_project },
          "Create Project"
        ),
        React.createElement(
          "h2",
          null,
          "Handle-It Work Items"
        ),
        this.create_workItems(true),
        React.createElement(
          "h2",
          null,
          "Project Work Items"
        ),
        this.create_workItems(false)
      );
    }
  }]);

  return ProjectTransferApp;
}(React.Component);

function loadReact() {
  ReactDOM.render(React.createElement(ProjectTransferApp, null), document.getElementById("project_transfer_container"));
}

loadReact();