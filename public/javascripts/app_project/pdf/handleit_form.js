var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HandleitForm = function (_React$Component) {
  _inherits(HandleitForm, _React$Component);

  function HandleitForm(props) {
    _classCallCheck(this, HandleitForm);

    // this.hide_elements();
    var _this = _possibleConstructorReturn(this, (HandleitForm.__proto__ || Object.getPrototypeOf(HandleitForm)).call(this, props));

    _this.hide_elements = function () {
      $('#navID').css('display', 'none');
      $('#userNav').css('display', 'none');
      // $('#noUserNav').css('display', 'none')
      $('#imageBar').css('display', 'none');
      $('#footerID').css('display', 'none');
      // $('#noUserNav').css('display', 'none')
    };

    _this.onClick_jspdf = function () {
      var doc = new jspdf.jsPDF({
        format: "letter"
      });
      var source = window.document.getElementsByTagName("body")[0];
      doc.html(source, {
        callback: function callback(doc) {
          doc.output("dataurlnewwindow");
        },
        x: 15, y: 15 });
    };

    _this.onClick_print = function () {
      window.print();
    };

    return _this;
  }

  _createClass(HandleitForm, [{
    key: 'roundCurrency',
    value: function roundCurrency(n) {
      var mult = 100,
          value = void 0;
      value = parseFloat((n * mult).toFixed(6));
      return Math.round(value) / mult;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var workitems = void 0,
          docApp = void 0;
      if (this.props.type == "project") {
        var proj = this.props.projectData;
        workitems = proj.workItems;
        docApp = proj.documentPackage.application;
      } else if (this.props.type == "assessment") {
        var assessment = this.props.assessmentData;
        workitems = assessment.workItems;
        docApp = assessment.documentPackage.application;
      }

      var name = docApp.name.middle && docApp.name.middle.length > 0 ? docApp.name.first + ' ' + docApp.name.middle + ' ' + docApp.name.last : docApp.name.first + ' ' + docApp.name.last;

      var address = docApp.address.line_1;
      if (docApp.address.line_2 && docApp.address.line_2.length > 0) {
        address += '| ' + docApp.address.line_2 + '\n';
      }
      var total_volunteers = 0;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { id: 'buttons-container', className: 'no-print' },
          React.createElement(
            'button',
            { onClick: this.onClick_print },
            'Print'
          )
        ),
        React.createElement(
          'div',
          { id: 'cblock-container' },
          React.createElement('img', { src: '/images/app_project/letterhead.png' })
        ),
        React.createElement(
          'p',
          { id: 'info-container' },
          'Catalyst Partnerships is a non-proft general contractor. We bring together useful resources and caring volunteers to meet the needs of under-resourced people in our community. \u201CHandle-It\u201D volunteers can provide minor home repairs to improve the safety of the home for no fee. Handle-It Volunteers are skilled handy men and women who have undergone and passed background checks and are insured by Catalyst. To the extent required by law, Catalyst is duly licensed, bonded, and insured to perform such work'
        ),
        React.createElement(
          'h1',
          { id: 'doc-header' },
          'HANDLE-IT WORK AGREEMENT'
        ),
        React.createElement(
          'table',
          null,
          React.createElement(
            'tbody',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                React.createElement(
                  'b',
                  null,
                  'Property Owner:'
                )
              ),
              React.createElement(
                'td',
                null,
                name
              )
            ),
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                React.createElement(
                  'b',
                  null,
                  'Address:'
                )
              ),
              React.createElement(
                'td',
                null,
                React.createElement(
                  'div',
                  null,
                  address
                ),
                React.createElement(
                  'div',
                  null,
                  docApp.address.city,
                  ', ',
                  docApp.address.state,
                  ' ',
                  docApp.address.zip
                )
              )
            ),
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                React.createElement(
                  'b',
                  null,
                  'Phone:'
                )
              ),
              React.createElement(
                'td',
                null,
                docApp.phone.preferred
              )
            ),
            React.createElement(
              'tr',
              null,
              React.createElement(
                'td',
                null,
                React.createElement(
                  'b',
                  null,
                  'Email:'
                )
              ),
              React.createElement(
                'td',
                null,
                docApp.email
              )
            )
          )
        ),
        React.createElement(
          'h2',
          null,
          'Work Requested'
        ),
        workitems.map(function (workItem) {
          var workitemCost = 0;
          workItem.materialsItems.forEach(function (materialsItem) {
            workitemCost += _this2.roundCurrency(materialsItem.price * materialsItem.quantity);
          });
          total_volunteers += workItem.volunteers_required;
          return React.createElement(
            'div',
            { className: 'workitem-total-container', key: workItem._id },
            React.createElement(
              'div',
              { key: "wi-" + workItem._id, className: 'workitem-container' },
              React.createElement(
                'table',
                null,
                React.createElement(
                  'tbody',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Work Item Name'
                    ),
                    React.createElement(
                      'td',
                      null,
                      workItem.name
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Description'
                    ),
                    React.createElement(
                      'td',
                      null,
                      workItem.description
                    )
                  ),
                  workItem.project_comments && workItem.project_comments.length > 0 ? React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Project Comments'
                    ),
                    React.createElement(
                      'td',
                      null,
                      workItem.project_comments
                    )
                  ) : null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Cost'
                    ),
                    React.createElement(
                      'td',
                      null,
                      workitemCost.toFixed(2)
                    )
                  )
                )
              )
            )
          );
        }),
        React.createElement(
          'p',
          { id: 'price-p' },
          'Price: Catalyst Partnerships shall provide resources for the work. The cost of this project to the property owner is $0.'
        ),
        React.createElement(
          'p',
          null,
          'Scope: The scope of Handle-It Projects are jobs that will require 1-3 volunteers one day\u2019s time and cost Catalyst $500 or less. In some cases, the property owner may already own the item that needs installation. If, after the Handle-It volunteer examines the scope of work, it is decided that the job would require more extensive labor and/or materials, this project may be recommended for consideration as a full Catalyst Project. This will require further fnancial vetting and estimation of the necessary work to restore the home to safety'
        ),
        React.createElement(
          'p',
          null,
          'Volunteer Labor: Catalyst Partnerships is responsible for providing volunteer labor required to complete this project. Catalyst Partnerships is also responsible for providing materials, tools, and all other resources required to complete this project. Due to the nature of this non-proft, volunteer activity, property owner understands that the quality of service and/or craftsmanship received may not refect professional standards.'
        ),
        React.createElement(
          'p',
          { id: 'acceptance-p' },
          'Acceptance of Contract: The above price, specifcations and conditions are satisfactory and are hereby accepted. Catalyst Partnerships is authorized to furnish all materials and volunteer labor required to complete the project as stated.'
        ),
        React.createElement(
          'div',
          { className: 'signatures-container' },
          React.createElement(
            'div',
            null,
            'Date __________________'
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              'X_______________________________________________'
            ),
            React.createElement(
              'div',
              null,
              'Property Owner'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'signatures-container' },
          React.createElement(
            'div',
            { className: '' },
            'Date __________________'
          ),
          React.createElement(
            'div',
            { className: '' },
            React.createElement(
              'div',
              null,
              'X_______________________________________________'
            ),
            React.createElement(
              'div',
              null,
              'Catalyst Handle-It Volunteer'
            )
          )
        ),
        React.createElement(
          'p',
          null,
          'Please sign two copies \u2013 one for the homeowner, the other for the Catalyst offce'
        )
      );
    }
  }]);

  return HandleitForm;
}(React.Component);

function loadReact() {
  console.log(type, assessment_id);
  if (type == "project") {
    $.ajax({
      url: "/app_project/projects/" + project_id,
      type: "GET",
      success: function success(data) {
        console.log(data);
        ReactDOM.render(React.createElement(HandleitForm, { type: type, projectData: data }), document.getElementById("pdf_container"));
      }
    });
  } else if (type == "assessment") {
    $.ajax({
      url: "/app_project/site_assessments/" + assessment_id,
      type: "GET",
      success: function success(data) {
        console.log(data);
        ReactDOM.render(React.createElement(HandleitForm, { type: type, assessmentData: data }), document.getElementById("pdf_container"));
      }
    });
  }
}

loadReact();