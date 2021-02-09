var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { WorkItem } from "./workitem.js";
import { CostSummary } from "./CostSummary.js";
import { AssessmentChecklist } from "./assessmentchecklist.js";
import { PartnerMenu } from "./components/PartnerMenu.js";

export { AssessmentMenu };

// Note: WorkItem uses the data in props saves it in state
// and updates it in state, thus becomes disconnected with the data here

var AssessmentMenu = function (_React$Component) {
  _inherits(AssessmentMenu, _React$Component);

  function AssessmentMenu(props) {
    _classCallCheck(this, AssessmentMenu);

    var _this = _possibleConstructorReturn(this, (AssessmentMenu.__proto__ || Object.getPrototypeOf(AssessmentMenu)).call(this, props));

    _this.change_assessment = function (assessment) {
      _this.setState(assessment);
      _this.checklist.current.load_assessment(assessment);
    };

    _this.add_workitem = function (workitem) {
      _this.setState({
        workItems: [workitem].concat(_toConsumableArray(_this.state.workItems))
      });
    };

    _this.remove_workitem = function (workitem_id) {
      // I'm not sure if the workitems themselves should be copied
      // But this is appending the original workitems to a new list
      var new_workitems = [];
      for (var i = 0; i < _this.state.workItems.length; i++) {
        if (_this.state.workItems[i]._id != workitem_id) {
          new_workitems.push(_this.state.workItems[i]);
        }
      }
      _this.setState({
        workItems: new_workitems
      });
    };

    _this.state = {
      workItems: []
    };
    _this.checklist = React.createRef();
    _this.costsummary = React.createRef();
    console.log("mm", _this.props.modalmenu);
    return _this;
  }

  _createClass(AssessmentMenu, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var that = this;
      // Tab changed. Newer versions of Bootstrap has a slight change in this
      // Load data when cost-summary is shown
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        if (e.target.id == "nav-cost-summary-tab") {
          that.costsummary.current.load_data("site_assessment", app_id);
        }
      });
      $("#nav-assessment-tabContent").css("padding-top", $("#assessment-nav-container").height());
      $("#assessment-nav-container").css("width", $("#nav-assessment-tabContent").width());
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var divStyle = {
        height: funkie.calculate_page_height().toString() + "px"
      };

      return React.createElement(
        "div",
        { className: "col-sm-12 col-lg-8", style: divStyle,
          id: "assessment-container" },
        React.createElement(
          "div",
          { id: "assessment-nav-container" },
          React.createElement(
            "ul",
            { className: "nav nav-tabs", id: "nav-assessment-tabs", role: "tablist" },
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link active", id: "nav-property-tab", "data-toggle": "tab",
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
                { className: "nav-link", id: "nav-checklist-tab", "data-toggle": "tab",
                  href: "#nav-checklist", role: "tab" },
                "Checklist"
              )
            ),
            React.createElement(
              "li",
              { className: "nav-item" },
              React.createElement(
                "a",
                { className: "nav-link", id: "nav-partner-tab", "data-toggle": "tab",
                  href: "#nav-partner", role: "tab" },
                "Partners"
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "tab-content overflow-auto", id: "nav-assessment-tabContent" },
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-checklist", role: "tabpanel" },
            React.createElement(AssessmentChecklist, { ref: this.checklist,
              assessment: {},
              vetting_summary: this.props.vetting_summary
            })
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-cost-summary", role: "tabpanel" },
            React.createElement(CostSummary, { ref: this.costsummary })
          ),
          React.createElement(
            "div",
            { className: "tab-pane show active", id: "nav-workitem", role: "tabpanel" },
            React.createElement(
              "button",
              { type: "button", className: "btn btn-primary",
                onClick: this.props.set_create_workitem_menu },
              "Create Work Item"
            ),
            this.state.workItems.map(function (workitem, index) {
              return React.createElement(WorkItem, {
                workitem: workitem,
                remove_workitem: _this2.remove_workitem,
                set_edit_materialisitem_menu: _this2.props.set_edit_materialisitem_menu,
                set_create_materialsitem_menu: _this2.props.set_create_materialsitem_menu,
                set_edit_workitem_menu: _this2.props.set_edit_workitem_menu,
                key: workitem._id + "-workitem-card" });
            })
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-partner", role: "tabpanel" },
            this.state._id ? React.createElement(PartnerMenu, {
              type: "siteAssessment", assessment_id: this.state._id,
              partners: this.state.partners,
              getModalMenu: this.props.getModalMenu
            }) : React.createElement("div", null)
          )
        )
      );
    }
  }]);

  return AssessmentMenu;
}(React.Component);