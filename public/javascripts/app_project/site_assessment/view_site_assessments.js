var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
          console.log(dataObj);
          this.setState(function (state) {
            var pending = [],
                complete = [],
                project_approval = [],
                project_approved = [],
                assessmentsByDocs = {};
            dataObj.assessments.forEach(function (assessment) {
              if (assessment.documentPackage in assessmentsByDocs) {
                window.alert("Assessments found with the document ID: " + assessment.documentPackage);
              }
              assessmentsByDocs[assessment.documentPackage] = assessment;
            });

            var assessment = void 0;
            dataObj.documents.forEach(function (doc) {
              assessment = assessmentsByDocs[doc._id];
              if (doc.status == "assess") {
                if (assessment && assessment.status != "pending") {
                  window.alert("Conflict document & assessment status found for document: " + doc.app_name);
                }
                pending.push(doc);
              } else if (doc.status == "assessComp") {
                if (!assessment) {
                  window.alert("No assessment found for document with completed status: " + doc.app_name);
                }
                if (assessment.status == "approval_process") {
                  project_approval.push(doc);
                } else if (assessment.status == "approved") {
                  project_approved.push(doc);
                } else if (assessment.status == "complete") {
                  complete.push(doc);
                } else {
                  window.alert("Conflict document & assessment status found for document: " + doc.app_name);
                }
              }
            });
            return {
              pendingDocs: pending,
              completeDocs: complete,
              project_approval: project_approval,
              project_approved: project_approved,
              assessmentsByDocs: assessmentsByDocs
            };
          });
        }
      });
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

    _this.createHeader = function () {
      return React.createElement(
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
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Assessment Date"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Assessment Status"
          )
        )
      );
    };

    _this.createRowWithDocument = function (doc) {
      var assessment = _this.state.assessmentsByDocs ? _this.state.assessmentsByDocs[doc._id] : null;
      return _this.createAssessmentRow(doc, assessment);
    };

    _this.createAssessmentRow = function (doc, assessment) {
      var addObj = doc.application.address,
          nameObj = doc.application.name;
      var address = addObj.line_2 ? addObj.line_1 + " " + addObj.line_2 : addObj.line_1;
      var assessment_date = void 0;
      if (assessment && assessment.assessment_date) {
        var d = _this.convert_date(assessment.assessment_date);
        // assessment_date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`
        assessment_date = /(.+:\d{2}):/.exec(d.toString())[1];
      }
      var status = assessment ? assessment.status : null,
          url = assessment ? "/app_project/site_assessments/view/" + assessment._id : "/app_project/site_assessments/view/app_id/" + doc._id,
          key = assessment ? assessment._id : doc._id;
      return React.createElement(
        "tr",
        { key: key },
        React.createElement(
          "td",
          null,
          React.createElement(
            "a",
            { href: url },
            doc.app_name
          )
        ),
        React.createElement(
          "td",
          null,
          nameObj.first,
          " ",
          nameObj.last
        ),
        React.createElement(
          "td",
          null,
          address,
          " | ",
          addObj.city,
          ", ",
          addObj.state,
          " ",
          addObj.zip
        ),
        React.createElement(
          "td",
          null,
          assessment_date
        ),
        React.createElement(
          "td",
          null,
          status
        )
      );
    };

    _this.state = {
      pendingDocs: [],
      completeDocs: [],
      project_approval: [],
      project_approved: [],
      transferredAssessments: [],
      showTransferred: false,
      assessmentsByDocs: {}
    };
    _this.loadSiteAssessment();
    return _this;
  }

  _createClass(SiteAssessmentApp, [{
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

    /**
     * Craetes Assessment TR Row with a document.
     * Searches for assessment in state.assessmentsByDocs and
     * uses createAssessmentRow
     * @param {DocumentPackage Data} doc 
     * @returns TR element of assessment
     */

    /**
     * Creates Assessment TR Row.
     * @param {DocumentPackage Data} doc 
     * @param {SiteAssessment Data} assessment 
     * @returns TR element of assessment
     */

  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var doc = void 0;
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
            this.createHeader(),
            React.createElement(
              "tbody",
              null,
              this.state.pendingDocs.map(function (document, index) {
                return _this2.createRowWithDocument(document);
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
            this.createHeader(),
            React.createElement(
              "tbody",
              null,
              this.state.completeDocs.map(function (document, index) {
                return _this2.createRowWithDocument(document);
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
            "Project Approval"
          ),
          React.createElement(
            "table",
            { className: "table" },
            this.createHeader(),
            React.createElement(
              "tbody",
              null,
              this.state.project_approval.map(function (document, index) {
                return _this2.createAssessmecreateRowWithDocumentntRow(document);
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
            "Project Approved"
          ),
          React.createElement(
            "table",
            { className: "table" },
            this.createHeader(),
            React.createElement(
              "tbody",
              null,
              this.state.project_approved.map(function (document, index) {
                return _this2.createRowWithDocument(document);
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
              this.createHeader(),
              React.createElement(
                "tbody",
                null,
                this.state.transferredAssessments.map(function (assessment) {
                  doc = assessment.documentPackage;
                  return _this2.createAssessmentRow(doc, assessment);
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