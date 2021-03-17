var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { DateMenuRow } from "../DateMenuRow.js";
import { PdfButtons } from "../components/PdfButtons.js";

export { AssessmentChecklist };

var AssessmentChecklist = function (_React$Component) {
  _inherits(AssessmentChecklist, _React$Component);

  function AssessmentChecklist(props) {
    _classCallCheck(this, AssessmentChecklist);

    var _this = _possibleConstructorReturn(this, (AssessmentChecklist.__proto__ || Object.getPrototypeOf(AssessmentChecklist)).call(this, props));
    // site_assessment directly loaded into state later (w/ ajax call)


    _this.load_assessment = function (assessment) {
      assessment.loaded_assessment = true;
      _this.setState(assessment, function () {
        // Set safety plan coloring after assessment is loaded
        _this.color_safety_plan_textarea();
      });
    };

    _this.color_safety_plan_textarea = function () {
      var textarea = document.getElementById("safety-plan-textarea");
      if (textarea.value.length < 6) {
        textarea.classList.add("warning-box");
      } else {
        textarea.classList.remove("warning-box");
      }
    };

    _this.onChange_select = function (e) {
      var assessment_id = _this.state._id,
          value = $(e.target).val(),
          property_type = e.target.getAttribute("property_type");
      if (property_type == "lead" || property_type == "asbestos") {
        var data = {
          property: property_type,
          value: value,
          assessment_id: assessment_id
        };
        funkie.edit_site_assessment(data, function (returnData) {
          _this.setState(_defineProperty({}, property_type, value));
        });
      }
    };

    _this.onChange_inputs_timer = function (e) {
      var property_type = e.target.getAttribute("property_type"),
          value = e.target.value;

      clearTimeout(_this[property_type + "_timer"]);

      _this.color_safety_plan_textarea();

      _this.setState(_defineProperty({}, property_type, value));

      _this[property_type + "_timer"] = setTimeout(function () {
        var data = {
          assessment_id: _this.state._id,
          property: property_type,
          value: value
        };
        funkie.edit_site_assessment(data); // No callback
      }, 1000);
    };

    _this.onChange_porta_checkbox = function (e) {
      funkie.edit_site_assessment({
        assessment_id: _this.state._id,
        property: "porta_potty_required",
        value: e.target.checked
      });
      _this.setState({
        porta_potty_required: e.target.checked
      });
    };

    _this.onChange_waste_checkbox = function (e) {
      funkie.edit_site_assessment({
        assessment_id: _this.state._id,
        property: "waste_required",
        value: e.target.checked
      });
      _this.setState({
        waste_required: e.target.checked
      });
    };

    _this.onChange_status = function (e) {
      var newStatus = e.target.value;
      if ((newStatus == "approval_process" || newStatus == "approved" || newStatus == "declined") && _this.state.status == "pending") {
        window.alert("The Assessment must first be completed!");
        return;
      }
      var result = true;
      if (newStatus == "declined") {
        result = window.confirm("Are you sure you want to decline the site assessment? \n        This can't be undone.");
      }

      if (result) {
        $.ajax({
          type: "PATCH",
          url: "/app_project/site_assessments/" + _this.state._id,
          context: _this,
          data: {
            assessment_id: _this.state._id,
            property: "status",
            value: newStatus
          },
          success: function success(returnData, textStatus, xhr) {
            console.log(returnData);
            this.setState({
              status: newStatus
            });
          },
          error: function error(xhr, textStatus, err) {
            window.alert("Error. Please check that all the work items have either accepted or declined.");
          }
        });
      }
    };

    _this.edit_drive_url = function () {
      var url = window.prompt("URL?", _this.state.drive_url),
          that = _this;
      console.log(url);
      if (url === null) return;
      if (url && url.includes("drive.google.com")) {
        funkie.edit_site_assessment({
          assessment_id: _this.state._id,
          property: "drive_url",
          value: url
        }, function () {
          that.setState({
            drive_url: url
          });
        });
      } else {
        window.alert("Wrong URL format was provided");
      }
    };

    _this.change_date_callback = function (data) {
      data.assessment_id = _this.state._id;
      data.property = data.date_type;

      funkie.edit_site_assessment(data);
    };

    _this.state = {
      porta_potty_required: false,
      waste_required: false,
      porta_potty_cost: 0,
      waste_cost: 0,
      loaded_assessment: false
    };
    _this.safety_plan_timer = null;
    _this.porta_potty_cost_timer = null;
    _this.waste_cost_timer = null;
    _this.summary_timer = null;
    return _this;
  }
  // Change the textarea background color if there is no safety plan

  // Set timer when text is typed


  _createClass(AssessmentChecklist, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "table",
          { className: "table" },
          React.createElement(
            "tbody",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Vetting Summary"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                this.props.vetting_summary
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Assessment Summary"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                React.createElement("textarea", { className: "form-control", value: this.state.summary,
                  property_type: "summary",
                  onChange: this.onChange_inputs_timer
                })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "PDFs"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                React.createElement(PdfButtons, { type: "assessment", handleit: false,
                  assessment_id: this.state._id })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Drive URL"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                React.createElement(
                  "a",
                  { href: this.state.drive_url, target: "_blank" },
                  "Google Drive URL"
                ),
                React.createElement(
                  "button",
                  { className: "btn btn-sm", onClick: this.edit_drive_url },
                  "Edit"
                )
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                React.createElement(
                  "label",
                  { htmlFor: "assessment-status-select" },
                  "Status"
                )
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                React.createElement(
                  "select",
                  { name: "assessment_status", className: "form-control",
                    onChange: this.onChange_status,
                    value: this.state.status,
                    id: "assessment-status-select" },
                  React.createElement(
                    "option",
                    { value: "pending" },
                    "Pending"
                  ),
                  React.createElement(
                    "option",
                    { value: "complete" },
                    "Complete"
                  ),
                  React.createElement(
                    "option",
                    { value: "approval_process" },
                    "Project Approval"
                  ),
                  React.createElement(
                    "option",
                    { value: "approved" },
                    "Project Approved"
                  ),
                  React.createElement(
                    "option",
                    { value: "declined" },
                    "Declined"
                  )
                )
              )
            )
          )
        ),
        this.state.loaded_assessment ? React.createElement(DateMenuRow, { title: "Assessment Date",
          date_type: "assessment_date",
          date: this.state.assessment_date,
          change_callback: this.change_date_callback
        }) : React.createElement("div", null),
        this.state.loaded_assessment ? React.createElement(DateMenuRow, { title: "Project Start Date",
          date_type: "project_start_date",
          date: this.state.project_start_date,
          change_callback: this.change_date_callback
        }) : React.createElement("div", null),
        this.state.loaded_assessment ? React.createElement(DateMenuRow, { title: "Project End Date",
          date_type: "project_end_date",
          date: this.state.project_end_date,
          change_callback: this.change_date_callback
        }) : React.createElement("div", null),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "label",
            { className: "col-sm-2 col-form-label" },
            "Lead"
          ),
          React.createElement(
            "div",
            { className: "col-sm-10" },
            React.createElement(
              "select",
              { className: "form-control", onChange: this.onChange_select,
                value: this.state.lead, property_type: "lead" },
              React.createElement(
                "option",
                { value: "yes" },
                "Yes"
              ),
              React.createElement(
                "option",
                { value: "no" },
                "No"
              ),
              React.createElement(
                "option",
                { value: "unsure" },
                "Unsure"
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "label",
            { className: "col-sm-2 col-form-label" },
            "Asbestos"
          ),
          React.createElement(
            "div",
            { className: "col-sm-10" },
            React.createElement(
              "select",
              { className: "form-control", onChange: this.onChange_select,
                value: this.state.asbestos, property_type: "asbestos" },
              React.createElement(
                "option",
                { value: "yes" },
                "Yes"
              ),
              React.createElement(
                "option",
                { value: "no" },
                "No"
              ),
              React.createElement(
                "option",
                { value: "unsure" },
                "Unsure"
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "label",
            { className: "col-sm-2 col-form-label" },
            "Safety Plan"
          ),
          React.createElement(
            "div",
            { className: "col-sm-10" },
            React.createElement("textarea", { className: "form-control", rows: "4",
              id: "safety-plan-textarea", placeholder: "Safety Plan must be filled in",
              value: this.state.safety_plan, property_type: "safety_plan",
              onChange: this.onChange_inputs_timer })
          )
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "div",
            { className: "col-sm-6 col-md-4" },
            React.createElement(
              "label",
              { className: "checkbox-label" },
              "Porta Potty "
            ),
            React.createElement("input", { type: "checkbox", id: "porta-potty-required-checkbox",
              checked: this.state.porta_potty_required,
              onChange: this.onChange_porta_checkbox
            })
          ),
          React.createElement(
            "div",
            { className: "col-sm-6 col-md-4" },
            React.createElement(
              "div",
              { className: "input-group input-group-sm" },
              React.createElement(
                "span",
                { className: "input-group-addon" },
                "Cost"
              ),
              React.createElement("input", { type: "number", className: "form-control", min: "0", step: "0.01",
                property_type: "porta_potty_cost",
                value: this.state.porta_potty_cost,
                onChange: this.onChange_inputs_timer,
                disabled: !this.state.porta_potty_required
              })
            )
          )
        ),
        React.createElement(
          "div",
          { className: "form-group row" },
          React.createElement(
            "div",
            { className: "col-sm-6 col-md-4" },
            React.createElement(
              "label",
              { className: "checkbox-label" },
              "Waste/Dump Trailer "
            ),
            React.createElement("input", { type: "checkbox",
              checked: this.state.waste_required,
              onChange: this.onChange_waste_checkbox
            })
          ),
          React.createElement(
            "div",
            { className: "col-sm-6 col-md-4" },
            React.createElement(
              "div",
              { className: "input-group input-group-sm" },
              React.createElement(
                "span",
                { className: "input-group-addon" },
                "Cost"
              ),
              React.createElement("input", { type: "number", className: "form-control", min: "0", step: "0.01",
                value: this.state.waste_cost,
                property_type: "waste_cost",
                onChange: this.onChange_inputs_timer,
                disabled: !this.state.waste_required
              })
            )
          )
        )
      );
    }
  }]);

  return AssessmentChecklist;
}(React.Component);