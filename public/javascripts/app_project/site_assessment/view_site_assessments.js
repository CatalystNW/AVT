var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SiteAssessmentApp = function (_React$Component) {
  _inherits(SiteAssessmentApp, _React$Component);

  function SiteAssessmentApp(props) {
    _classCallCheck(this, SiteAssessmentApp);

    var _this = _possibleConstructorReturn(this, (SiteAssessmentApp.__proto__ || Object.getPrototypeOf(SiteAssessmentApp)).call(this, props));

    _this.loadSiteAssessment = function () {
      $.ajax({
        url: "/app_project/site_assessments/applications",
        type: "GET",
        context: _this,
        success: function success(dataObj) {
          this.setState(function (state) {
            var pending = [],
                complete = [];
            dataObj.documents.forEach(function (doc) {
              if (doc.status == "assess") {
                pending.push(doc);
              } else if (doc.status == "assessComp") {
                complete.push(doc);
              }
            });
            return {
              pendingDocs: pending,
              completeDocs: complete
            };
          });
        }
      });
    };

    _this.createAssessmentRow = function (doc) {
      var address = doc.address.line_2 ? doc.address.line_1 + " " + doc.address.line_2 : doc.address.line_1;
      return React.createElement(
        "tr",
        { key: doc.id },
        React.createElement(
          "td",
          null,
          React.createElement(
            "a",
            { target: "_blank", href: "./view_site_assessments/app_id/" + doc.id },
            doc.app_name
          )
        ),
        React.createElement(
          "td",
          null,
          doc.name.first,
          " ",
          doc.name.last
        ),
        React.createElement(
          "td",
          null,
          address,
          " |",
          doc.address.city,
          ", ",
          doc.address.state,
          " ",
          doc.address.zip
        )
      );
    };

    _this.getTransferredAssessments = function () {
      $.ajax({
        url: '/app_project/site_assessments/transferred',
        type: "GET",
        context: _this,
        success: function success(assessments) {
          console.log(assessments);
          this.setState({
            transferredAssessments: assessments
          });
        }
      });
    };

    _this.toggleShowTransferred = function () {
      if (!_this.state.showTransferred) {
        _this.getTransferredAssessments();
      }
      _this.setState(function (state) {
        return {
          showTransferred: !state.showTransferred
        };
      });
    };

    _this.state = {
      pendingDocs: [],
      completeDocs: [],
      transferredAssessments: [],
      showTransferred: false
    };
    _this.loadSiteAssessment();
    return _this;
  }

  _createClass(SiteAssessmentApp, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var doc = void 0,
          address = void 0,
          app = void 0;
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          null,
          React.createElement(
            "h2",
            null,
            "Pending Assessments"
          ),
          React.createElement(
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
                  "Application #"
                ),
                React.createElement(
                  "th",
                  { scope: "col" },
                  "Name"
                ),
                React.createElement(
                  "th",
                  { scope: "col" },
                  "Address"
                )
              )
            ),
            React.createElement(
              "tbody",
              null,
              this.state.pendingDocs.map(function (doc, index) {
                return _this2.createAssessmentRow(doc);
              })
            )
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h2",
            null,
            "Complete Assessments"
          ),
          React.createElement(
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
                  "Application #"
                ),
                React.createElement(
                  "th",
                  { scope: "col" },
                  "Name"
                ),
                React.createElement(
                  "th",
                  { scope: "col" },
                  "Address"
                )
              )
            ),
            React.createElement(
              "tbody",
              null,
              this.state.completeDocs.map(function (doc, index) {
                return _this2.createAssessmentRow(doc);
              })
            )
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h2",
            { onClick: this.toggleShowTransferred },
            "Transferred Assessments",
            React.createElement(
              "button",
              { type: "button",
                className: "btn btn-sm" },
              this.state.showTransferred ? "Hide" : "Show"
            )
          ),
          this.state.showTransferred ? React.createElement(
            "div",
            null,
            React.createElement(
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
                    "Application #"
                  ),
                  React.createElement(
                    "th",
                    { scope: "col" },
                    "Name"
                  ),
                  React.createElement(
                    "th",
                    { scope: "col" },
                    "Address"
                  )
                )
              ),
              React.createElement(
                "tbody",
                null,
                this.state.transferredAssessments.map(function (assessment) {
                  doc = assessment.documentPackage;
                  app = doc.application;
                  address = app.address.line_2 ? app.address.line_1 + " " + app.address.line_2 : doc.address.line_1;
                  return React.createElement(
                    "tr",
                    { key: assessment._id },
                    React.createElement(
                      "td",
                      null,
                      React.createElement(
                        "a",
                        { target: "_blank", href: "./view_site_assessments/" + assessment._id },
                        doc.app_name
                      )
                    ),
                    React.createElement(
                      "td",
                      null,
                      app.name.first,
                      " ",
                      app.name.last
                    ),
                    React.createElement(
                      "td",
                      null,
                      address,
                      " | ",
                      app.address.city,
                      ", ",
                      app.address.state,
                      " ",
                      app.address.zip
                    )
                  );
                })
              )
            )
          ) : null
        )
      );
    }
  }]);

  return SiteAssessmentApp;
}(React.Component);

(function loadReact() {
  ReactDOM.render(React.createElement(SiteAssessmentApp, null), document.getElementById("assessments_container"));
})();