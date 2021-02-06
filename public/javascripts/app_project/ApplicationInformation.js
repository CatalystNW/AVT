var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { ProjectNotes } from "./components/project/projectnotes.js";

export { ApplicationInformation };

var ApplicationInformation = function (_React$Component) {
  _inherits(ApplicationInformation, _React$Component);

  function ApplicationInformation(props) {
    _classCallCheck(this, ApplicationInformation);

    var _this = _possibleConstructorReturn(this, (ApplicationInformation.__proto__ || Object.getPrototypeOf(ApplicationInformation)).call(this, props));

    _this.calculate_age = function () {
      var dob = new Date(_this.props.application.dob.year, _this.props.application.dob.month, _this.props.application.dob.date),
          d = new Date();
      var years = d.getFullYear() - dob.getFullYear();

      if (d.getMonth() < dob.getMonth() || d.getMonth() == dob.getMonth() && d.getDate() < dob.getDate()) years--;

      return years;
    };

    _this.create_applicant_info_page = function () {
      var app = _this.props.application;
      var address = app.line_2 == "" ? React.createElement(
        "span",
        null,
        app.line_1,
        React.createElement("br", null),
        app.city,
        ", ",
        app.state,
        " ",
        app.zip
      ) : React.createElement(
        "span",
        null,
        app.line_1,
        React.createElement("br", null),
        app.line_2,
        React.createElement("br", null),
        app.city,
        ", ",
        app.state,
        " ",
        app.zip
      );
      var owns_home = app.owns_home ? "Yes" : "No";

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
                "Name"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                name
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Address"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                address
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Phone"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.phone
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Email"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.email
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Emergency Contact"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.emergency_name,
                React.createElement("br", null),
                app.emergency_relationship,
                React.createElement("br", null),
                app.emergency_phone
              )
            )
          )
        ),
        React.createElement(
          "h3",
          null,
          "Applicant Info"
        ),
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
                "Age"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                _this.calculate_age()
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Owns Home"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                owns_home,
                React.createElement("br", null)
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Spouse"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.spouse
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Other Residents"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.other_residents_names.map(function (name, index) {
                  return React.createElement(
                    "div",
                    { key: "res-" + index },
                    name,
                    " (",
                    app.other_residents_age[index],
                    ") - ",
                    app.other_residents_relationship[index]
                  );
                })
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Language"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.language,
                React.createElement("br", null)
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Heard About"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.heard_about,
                React.createElement("br", null)
              )
            )
          )
        )
      );
    };

    _this.create_property_page = function () {
      var app = _this.props.application;
      var can_contribute = app.client_can_contribute ? app.client_can_contribute_description : "No",
          ass_can_contribute = app.associates_can_contribute ? app.associates_can_contribute_description : "No";

      return React.createElement(
        "div",
        null,
        React.createElement(
          "h3",
          null,
          "Property Information"
        ),
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
                "Home Type"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.home_type
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Ownership Length"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.ownership_length
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Years Constructed"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.year_constructed
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Requested Repairs"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                app.requested_repairs
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Client Can Contribute"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                can_contribute
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "th",
                { className: "col-xs-3" },
                "Assoc. Can Contribute"
              ),
              React.createElement(
                "td",
                { className: "col-xs-9" },
                ass_can_contribute
              )
            )
          )
        )
      );
    };

    _this.get_site_assessment = function () {
      funkie.get_assessment(_this.props.assessment_id, function (data) {
        console.log(data);
        _this.setState({
          site_assessment: data
        });
      });
    };

    _this.create_assessment_page = function () {
      if (_this.state.site_assessment == null) {
        _this.get_site_assessment();
        return React.createElement("div", null);
      } else {
        var assessment = _this.state.site_assessment;
        return React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            "Info"
          ),
          React.createElement(
            "table",
            { className: "table table-sm" },
            React.createElement(
              "tbody",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row", className: "col-xs-6 col-md-4" },
                  "Summary"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-xs-8" },
                  assessment.summary
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row", className: "col-xs-6 col-md-4" },
                  "Lead"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-xs-8" },
                  assessment.lead
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row", className: "col-xs-6 col-md-4" },
                  "Asbestos"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-xs-8" },
                  assessment.asbestos
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row", className: "col-xs-6 col-md-4" },
                  "Safety Plan"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-xs-8" },
                  assessment.safety_plan
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row", className: "col-xs-6 col-md-4" },
                  "Waste Dumpster"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-xs-8" },
                  React.createElement(
                    "div",
                    null,
                    "Required : ",
                    assessment.waste_required ? "Yes" : "No"
                  ),
                  React.createElement(
                    "div",
                    null,
                    "Cost: ",
                    assessment.waste_cost
                  )
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row", className: "col-xs-6 col-md-4" },
                  "Porta Potty"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-xs-8" },
                  React.createElement(
                    "div",
                    null,
                    "Required : ",
                    assessment.porta_potty_required ? "Yes" : "No"
                  ),
                  React.createElement(
                    "div",
                    null,
                    "Cost: ",
                    assessment.porta_potty_cost
                  )
                )
              ),
              React.createElement(
                "tr",
                null,
                React.createElement(
                  "th",
                  { scope: "row", className: "col-xs-6 col-md-4" },
                  "Google Drive"
                ),
                React.createElement(
                  "td",
                  { className: "col-xs-6 col-xs-8" },
                  assessment.drive_url ? React.createElement(
                    "a",
                    { href: assessment.drive_url, target: "_blank" },
                    "URL"
                  ) : ""
                )
              )
            )
          )
        );
      }
    };

    _this.state = {
      site_assessment: null
    };
    return _this;
  }

  _createClass(ApplicationInformation, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $("#nav-app-tabContent").css("padding-top", $("#application-info-nav-container").height());
      $("#application-info-nav-container").css("width", $("#nav-app-tabContent").width());
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      $("#nav-app-tabContent").css("padding-top", $("#application-info-nav-container").height());
      $("#application-info-nav-container").css("width", $("#nav-app-tabContent").width());
    }
  }, {
    key: "render",
    value: function render() {
      var app = this.props.application;
      if (app === null) {
        return React.createElement("div", null);
      }

      var assessment_tab, assessment_page, application_page, property_page, property_tab, proj_note_tab, proj_note_page;
      if (this.props.view_type && this.props.view_type == "project") {
        assessment_tab = React.createElement(
          "a",
          { className: "nav-item nav-link", id: "nav-site-assessment-tab", "data-toggle": "tab",
            href: "#nav-site-assessment", role: "tab" },
          "Assessment"
        );

        assessment_page = this.create_assessment_page();

        // Split application page into two tabs for assessment. Combine for projects
        application_page = React.createElement(
          "div",
          { className: "tab-pane", id: "nav-app-info", role: "tabpanel" },
          this.create_applicant_info_page(),
          this.create_property_page()
        );

        proj_note_tab = React.createElement(
          "a",
          { className: "nav-item nav-link active", id: "nav-proj-note-tab", "data-toggle": "tab",
            href: "#nav-proj-note", role: "tab" },
          "Notes"
        );
        proj_note_page = React.createElement(
          "div",
          { className: "tab-pane show active", id: "nav-proj-note", role: "tabpanel" },
          React.createElement(ProjectNotes, { project_id: this.props.project_id })
        );
      } else {
        application_page = React.createElement(
          "div",
          { className: "tab-pane show active", id: "nav-app-info", role: "tabpanel" },
          this.create_applicant_info_page()
        );
        property_tab = React.createElement(
          "a",
          { className: "nav-item nav-link", id: "nav-property-tab", "data-toggle": "tab",
            href: "#nav-property-info", role: "tab" },
          "Property"
        );
        property_page = React.createElement(
          "div",
          { className: "tab-pane", id: "nav-property-info", role: "tabpanel" },
          this.create_property_page()
        );
      }

      // set to browser height so that overflow will show both divs with scrollbars
      var divStyle = {
        height: funkie.calculate_page_height().toString() + "px"
      };

      var name = app.middle_name == "" ? app.first_name + " " + app.last_name : app.first_name + " " + app.middle_name + " " + app.last_name;

      var google_url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyD2CmgnSECdg_g-aFgp95NUBv2QUEidDvs&q=";
      google_url += app.line_1 + " " + app.line_2 + ", " + app.city + ", " + app.state + ", " + app.zip;

      return React.createElement(
        "div",
        { className: "col-sm-12 col-lg-4", style: divStyle,
          id: "application-info-container" },
        React.createElement(
          "div",
          { id: "application-info-nav-container" },
          React.createElement(
            "h2",
            null,
            name
          ),
          React.createElement(
            "ul",
            { className: "nav nav-tabs ", id: "nav-app-tab", role: "tablist" },
            React.createElement(
              "a",
              { className: "nav-item nav-link", id: "nav-app-tab", "data-toggle": "tab",
                href: "#nav-app-info", role: "tab" },
              "Application"
            ),
            property_tab,
            assessment_tab,
            React.createElement(
              "a",
              { className: "nav-item nav-link", id: "nav-map-tab", "data-toggle": "tab",
                href: "#nav-map-info", role: "tab" },
              "Map"
            ),
            proj_note_tab
          )
        ),
        React.createElement(
          "div",
          { className: "tab-content overflow-auto", id: "nav-app-tabContent" },
          application_page,
          property_page,
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-site-assessment", role: "tabpanel" },
            assessment_page
          ),
          React.createElement(
            "div",
            { className: "tab-pane", id: "nav-map-info", role: "tabpanel" },
            React.createElement(
              "iframe",
              { width: "100%", height: "280", frameBorder: "0",
                src: google_url, target: "_blank" },
              "Google Maps Link"
            )
          ),
          proj_note_page
        )
      );
    }
  }]);

  return ApplicationInformation;
}(React.Component);