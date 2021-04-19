var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { UpcomingProjects };

var UpcomingProjects = function (_React$Component) {
  _inherits(UpcomingProjects, _React$Component);

  function UpcomingProjects(props) {
    _classCallCheck(this, UpcomingProjects);

    var _this = _possibleConstructorReturn(this, (UpcomingProjects.__proto__ || Object.getPrototypeOf(UpcomingProjects)).call(this, props));

    _this.loadData = function () {
      $.ajax({
        url: "/app_project/report/upcoming",
        type: "GET",
        context: _this,
        success: function success(projectsData) {
          var _this2 = this;

          var projects = [],
              handleits = [];

          console.log(projectsData);

          projectsData.forEach(function (project) {
            if (project.start) project.start = _this2.convert_date(project.start);
            if (project.handleit) {
              projects.push(project);
            } else {
              handleits.push(project);
            }
          });
          this.setState({
            projects: projects,
            handleits: handleits
          });
        }
      });
    };

    _this.createTable = function (projects) {
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
              "Name"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Start Date"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Location"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Work Items"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Home Type"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "CC"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "PA"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "SH"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Partners"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Volunteers"
            ),
            React.createElement(
              "th",
              { scope: "col" },
              "Cost"
            )
          )
        ),
        React.createElement(
          "tbody",
          null,
          projects.map(function (project) {
            var cost = 0,
                volunteers = 0;
            project.workItems.forEach(function (workItem) {
              workItem.materialsItems.map(function (materialsItem) {
                cost += materialsItem.price * materialsItem.quantity;
              });
              volunteers += workItem.volunteers_required;
            });
            return React.createElement(
              "tr",
              { key: project._id },
              React.createElement(
                "td",
                null,
                React.createElement(
                  "a",
                  { href: "/app_project/view_projects/" + project._id, target: "_blank" },
                  project.documentPackage.application.name.first + " " + project.documentPackage.application.name.last
                )
              ),
              React.createElement(
                "td",
                null,
                project.start ? project.start.toLocaleDateString() : "None"
              ),
              React.createElement(
                "td",
                null,
                project.documentPackage.application.address.city
              ),
              React.createElement(
                "td",
                null,
                project.workItems.map(function (workItem) {
                  return React.createElement(
                    "div",
                    { key: project._id + "_" + workItem._id },
                    workItem.name
                  );
                })
              ),
              React.createElement(
                "td",
                null,
                project.documentPackage.property.home_type
              ),
              React.createElement(
                "td",
                null,
                project.crew_chief ? project.crew_chief : "N/A"
              ),
              React.createElement(
                "td",
                null,
                project.project_advocate ? project.project_advocate : "N/A"
              ),
              React.createElement(
                "td",
                null,
                project.site_host ? project.site_host : "N/A"
              ),
              React.createElement(
                "td",
                null,
                project.partners.map(function (partner) {
                  return React.createElement(
                    "div",
                    { key: project._id + "_" + partner._id },
                    partner.org_name
                  );
                })
              ),
              React.createElement(
                "td",
                null,
                volunteers
              ),
              React.createElement(
                "td",
                null,
                _this.roundCurrency(cost).toFixed(2)
              )
            );
          })
        )
      );
    };

    _this.state = {
      projects: [],
      handleits: []
    };
    _this.loadData();
    return _this;
  }

  _createClass(UpcomingProjects, [{
    key: "convert_date",
    value: function convert_date(old_date) {
      var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
          result = regex.exec(old_date);
      if (result) {
        var _result$slice = result.slice(1, 6),
            _result$slice2 = _slicedToArray(_result$slice, 5),
            year = _result$slice2[0],
            month = _result$slice2[1],
            date = _result$slice2[2],
            hours = _result$slice2[3],
            minutes = _result$slice2[4];

        return new Date(Date.UTC(year, parseInt(month) - 1, date, hours, minutes));
      }
      return null;
    }
  }, {
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
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h1",
          null,
          "Upcoming Projects"
        ),
        React.createElement(
          "h2",
          null,
          "Handle-It Projects"
        ),
        this.createTable(this.state.handleits),
        React.createElement(
          "h2",
          null,
          "Projects"
        ),
        this.createTable(this.state.projects)
      );
    }
  }]);

  return UpcomingProjects;
}(React.Component);