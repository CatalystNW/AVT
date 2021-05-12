var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { PartnersReport };

import { functionHelper } from "../functionHelper.js";

var PartnersReport = function (_React$Component) {
  _inherits(PartnersReport, _React$Component);

  function PartnersReport(props) {
    _classCallCheck(this, PartnersReport);

    var _this = _possibleConstructorReturn(this, (PartnersReport.__proto__ || Object.getPrototypeOf(PartnersReport)).call(this, props));

    _this.getPartners = function () {
      $.ajax({
        url: "/app_project/report/partners",
        type: "GET",
        context: _this,
        success: function success(data) {
          console.log(data);
          var partnersDict = {};
          var partnersData = data.partners,
              projectsData = data.projects;
          var i = void 0;
          for (i = 0; i < partnersData.length; i++) {
            partnersDict[partnersData[i]._id] = partnersData[i];
            partnersDict[partnersData[i]._id].projects = [];
          }

          for (i = 0; i < projectsData.length; i++) {
            projectsData[i].partners.forEach(function (partner) {
              if (partner in partnersDict) {
                partnersDict[partner].projects.push(projectsData[i]);
              }
            });
          }
          this.setState({
            partners: Object.values(partnersDict)
          });
        }
      });
    };

    _this.onClick_partnersRow = function (e) {
      var partnerId = e.target.value;
      _this.setState(function (state) {
        var newShowPartnerProjects = new Set(_this.state.showPartnerProjects);
        if (newShowPartnerProjects.has(partnerId)) {
          newShowPartnerProjects.delete(partnerId);
        } else {
          newShowPartnerProjects.add(partnerId);
        }
        return {
          showPartnerProjects: newShowPartnerProjects
        };
      });
    };

    _this.createPartnersTable = function () {
      var partners = _this.state.partners,
          i = void 0,
          tr = void 0;

      var rows = [];
      console.log(partners);
      for (i = 0; i < partners.length; i++) {
        tr = React.createElement(
          "tr",
          { key: partners[i]._id,
            className: "clickable" },
          React.createElement(
            "td",
            null,
            partners[i].org_name
          ),
          React.createElement(
            "td",
            null,
            partners[i].org_address
          ),
          React.createElement(
            "td",
            null,
            partners[i].contact_phone
          ),
          React.createElement(
            "td",
            null,
            partners[i].contact_email
          ),
          React.createElement(
            "td",
            null,
            React.createElement(
              "button",
              { className: "btn btn-outline-primary btn-sm",
                value: partners[i]._id,
                onClick: _this.onClick_partnersRow },
              partners[i].projects.length
            )
          )
        );
        rows.push(tr);

        if (_this.state.showPartnerProjects.has(partners[i]._id)) {
          partners[i].projects.forEach(function (project) {
            rows.push(React.createElement(
              "tr",
              { className: "project-partner-row",
                key: "proj-" + partners[i]._id + "-" + project._id },
              React.createElement(
                "th",
                null,
                "Project Name"
              ),
              React.createElement(
                "td",
                null,
                project.name && project.name.length > 0 ? project.name : "N/A"
              ),
              React.createElement(
                "th",
                null,
                "Status"
              ),
              React.createElement(
                "td",
                null,
                project.status
              ),
              React.createElement(
                "td",
                null,
                project.start ? functionHelper.convert_date(project.start).toLocaleDateString() : "None"
              )
            ));
          });
        }
      }
      return React.createElement(
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
              "Organization"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Address"
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
              "# Projects"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          rows
        )
      );
    };

    _this.state = {
      partners: [],
      showPartnerProjects: new Set()
    };
    return _this;
  }

  _createClass(PartnersReport, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.createPartnersTable()
      );
    }
  }]);

  return PartnersReport;
}(React.Component);