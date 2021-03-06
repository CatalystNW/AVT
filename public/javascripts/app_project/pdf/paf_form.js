var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PAFApp = function (_React$Component) {
  _inherits(PAFApp, _React$Component);

  function PAFApp(props) {
    _classCallCheck(this, PAFApp);

    // this.hide_elements();
    var _this = _possibleConstructorReturn(this, (PAFApp.__proto__ || Object.getPrototypeOf(PAFApp)).call(this, props));

    _this.getState = function () {
      var workitems = void 0,
          data = void 0;
      if (_this.props.type == "project") {
        data = _this.props.projectData;
      } else if (_this.props.type == "assessment") {
        data = _this.props.assessmentData;
      } else {
        return;
      }
      workitems = data.workItems;

      var filteredWorkitems = [];
      workitems.forEach(function (workitem) {
        if (workitem.status != "declined") {
          filteredWorkitems.push(workitem);
        }
      });
      return {
        workitems: filteredWorkitems,
        porta_potty_cost: data.porta_potty_required ? data.porta_potty_cost : 0,
        waste_cost: data.waste_required ? data.waste_cost : 0
      };
    };

    _this.hide_elements = function () {
      $('#navID').css('display', 'none');
      $('#userNav').css('display', 'none');
      // $('#noUserNav').css('display', 'none')
      $('#imageBar').css('display', 'none');
      $('#footerID').css('display', 'none');
      // $('#noUserNav').css('display', 'none')
    };

    _this.onClick_print = function () {
      window.print();
    };

    _this.state = _this.getState();
    return _this;
  }

  // Get work items from props and return an array of non-decliend ones


  _createClass(PAFApp, [{
    key: "roundCurrency",
    value: function roundCurrency(n) {
      var mult = 100,
          value = void 0;
      value = parseFloat((n * mult).toFixed(6));
      return Math.round(value) / mult;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var docApp = void 0,
          documentPackage = void 0,
          siteAssessment = void 0,
          partners = void 0;
      if (this.props.type == "project") {
        var proj = this.props.projectData;
        docApp = proj.documentPackage.application;
        documentPackage = proj.documentPackage;
        siteAssessment = proj.siteAssessment;
        partners = proj.partners;
      } else if (this.props.type == "assessment") {
        var assessment = this.props.assessmentData;
        docApp = assessment.documentPackage.application;
        documentPackage = assessment.documentPackage;
        siteAssessment = assessment;
        partners = assessment.partners;
      } else {
        return;
      }
      var d = new Date();
      var date_string = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
      var name = docApp.name.middle && docApp.name.middle.length > 0 ? docApp.name.first + " " + docApp.name.middle + " " + docApp.name.last : docApp.name.first + " " + docApp.name.last;
      if (docApp.name.preferred && docApp.name.preferred.length > 0) name += " (Preferred: " + docApp.name.preferred + ")";

      var address = docApp.address.line_1;
      if (docApp.address.line_2 && docApp.address.line_2.length > 0) {
        address += "| " + docApp.address.line_2 + "\n";
      }
      var total_cost = 0,
          total_volunteers = 0,
          cost = void 0,
          subtotal = void 0;
      var vet_summary = documentPackage && documentPackage.notes ? documentPackage.notes.vet_summary : null,
          assessment_summary = siteAssessment.summary;
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { id: "buttons-container", className: "no-print" },
          React.createElement(
            "button",
            { onClick: this.onClick_print },
            "Print"
          )
        ),
        React.createElement(
          "div",
          { id: "cblock-container" },
          React.createElement("img", { src: "/images/app_project/letterhead.png" })
        ),
        React.createElement(
          "h1",
          { id: "doc-header" },
          "PROJECT ASSESSMENT FORM ",
          date_string
        ),
        React.createElement(
          "table",
          null,
          React.createElement(
            "tbody",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                React.createElement(
                  "b",
                  null,
                  "Recipient Name: "
                )
              ),
              React.createElement(
                "td",
                null,
                name
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                React.createElement(
                  "b",
                  null,
                  "Address:"
                )
              ),
              React.createElement(
                "td",
                null,
                React.createElement(
                  "div",
                  null,
                  address
                ),
                React.createElement(
                  "div",
                  null,
                  docApp.address.city,
                  ", ",
                  docApp.address.state,
                  " ",
                  docApp.address.zip
                )
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                React.createElement(
                  "b",
                  null,
                  "Vetting Summary"
                )
              ),
              React.createElement(
                "td",
                null,
                vet_summary
              )
            ),
            React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                null,
                React.createElement(
                  "b",
                  null,
                  "Assessment Summary"
                )
              ),
              React.createElement(
                "td",
                null,
                assessment_summary
              )
            )
          )
        ),
        React.createElement(
          "h2",
          null,
          React.createElement(
            "b",
            null,
            "Work Items"
          )
        ),
        this.state.workitems.map(function (workItem) {
          subtotal = 0;
          total_volunteers += workItem.volunteers_required;

          workItem.materialsItems.forEach(function (materialsItem) {
            subtotal += materialsItem.price * materialsItem.quantity;
          });

          subtotal = _this2.roundCurrency(subtotal);
          total_cost += subtotal;
          return React.createElement(
            "div",
            { className: "workitem-total-container", key: workItem._id },
            React.createElement(
              "div",
              { key: "wi-" + workItem._id, className: "workitem-container" },
              React.createElement(
                "table",
                null,
                React.createElement(
                  "tbody",
                  null,
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Work Item Name"
                    ),
                    React.createElement(
                      "td",
                      null,
                      workItem.name
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Subtotal"
                    ),
                    React.createElement(
                      "td",
                      null,
                      "$",
                      subtotal.toFixed(2)
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Description"
                    ),
                    React.createElement(
                      "td",
                      null,
                      workItem.description
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Site Comments"
                    ),
                    React.createElement(
                      "td",
                      null,
                      workItem.assessment_comments
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Volunteers Needed"
                    ),
                    React.createElement(
                      "td",
                      null,
                      workItem.volunteers_required
                    )
                  )
                )
              )
            )
          );
        }),
        React.createElement(
          "h2",
          null,
          React.createElement(
            "b",
            null,
            "Cost"
          )
        ),
        React.createElement(
          "div",
          null,
          "Total Work Items Cost: $",
          total_cost.toFixed(2)
        ),
        React.createElement(
          "div",
          null,
          "Porta Potty Cost: $",
          this.state.porta_potty_cost.toFixed(2)
        ),
        React.createElement(
          "div",
          null,
          "Waste/Dump Trailer Cost: $",
          this.state.waste_cost.toFixed(2)
        ),
        React.createElement(
          "div",
          null,
          "Final Cost Estimate: $",
          (total_cost + this.state.porta_potty_cost + this.state.waste_cost).toFixed(2)
        ),
        React.createElement(
          "div",
          null,
          "Total Volunteers Needed: ",
          total_volunteers
        ),
        React.createElement(
          "h2",
          null,
          React.createElement(
            "b",
            null,
            "Hazard / Safety Testing"
          )
        ),
        React.createElement(
          "div",
          null,
          "Lead: ",
          siteAssessment.lead
        ),
        React.createElement(
          "div",
          null,
          "Asbestos: ",
          siteAssessment.asbestos
        ),
        React.createElement(
          "div",
          null,
          "Safety Plan: ",
          siteAssessment.safety_plan
        ),
        React.createElement(
          "h2",
          null,
          React.createElement(
            "b",
            null,
            "Partners"
          )
        ),
        React.createElement(
          "div",
          { id: "partners-container" },
          partners.map(function (partner) {
            return React.createElement(
              "div",
              { className: "partner-container", key: partner._id },
              React.createElement(
                "table",
                null,
                React.createElement(
                  "tbody",
                  null,
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Organization"
                    ),
                    React.createElement(
                      "td",
                      null,
                      partner.org_name
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Address"
                    ),
                    React.createElement(
                      "td",
                      null,
                      partner.org_address
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Contact"
                    ),
                    React.createElement(
                      "td",
                      null,
                      partner.contact_name
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Email"
                    ),
                    React.createElement(
                      "td",
                      null,
                      partner.contact_email
                    )
                  ),
                  React.createElement(
                    "tr",
                    null,
                    React.createElement(
                      "th",
                      null,
                      "Phone"
                    ),
                    React.createElement(
                      "td",
                      null,
                      partner.contact_phone
                    )
                  )
                )
              )
            );
          })
        )
      );
    }
  }]);

  return PAFApp;
}(React.Component);

function loadReact() {
  if (type == "project") {
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      success: function success(data) {
        console.log(data);
        ReactDOM.render(React.createElement(PAFApp, { type: type, projectData: data }), document.getElementById("pdf_container"));
      }
    });
  } else if (type == "assessment") {
    $.ajax({
      url: "/app_project/site_assessments/" + assessment_id,
      type: "GET",
      success: function success(data) {
        console.log(data);
        ReactDOM.render(React.createElement(PAFApp, { type: type, assessmentData: data }), document.getElementById("pdf_container"));
      }
    });
  }
}

loadReact();