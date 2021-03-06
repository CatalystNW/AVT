var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HandleitForm = function (_React$Component) {
  _inherits(HandleitForm, _React$Component);

  function HandleitForm(props) {
    _classCallCheck(this, HandleitForm);

    var _this = _possibleConstructorReturn(this, (HandleitForm.__proto__ || Object.getPrototypeOf(HandleitForm)).call(this, props));

    _this.hide_elements = function () {
      $('#navID').css('display', 'none');
      $('#userNav').css('display', 'none');
      // $('#noUserNav').css('display', 'none')
      $('#imageBar').css('display', 'none');
      $('#footerID').css('display', 'none');
      // $('#noUserNav').css('display', 'none')
    };

    _this.state = {
      projectData: _this.props.projectData
    };
    // this.hide_elements();
    return _this;
  }

  _createClass(HandleitForm, [{
    key: 'render',
    value: function render() {
      var proj = this.state.projectData;
      var d = new Date();
      var docApp = this.state.projectData.documentPackage.application;
      var date_string = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
      var name = docApp.name.middle && docApp.name.middle.length > 0 ? docApp.name.first + ' ' + docApp.name.middle + ' ' + docApp.name.last : docApp.name.first + ' ' + docApp.name.last;
      if (docApp.name.preferred && docApp.name.preferred.length > 0) name += ' (Preferred: ' + docApp.name.preferred + ')';

      var address = docApp.address.line_1;
      if (docApp.address.line_2 && docApp.address.line_2.length > 0) {
        address += '| ' + docApp.address.line_2 + '\n';
      }
      var total_cost = 0,
          total_volunteers = 0;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          { id: 'doc-header' },
          'CATALYST PARTNERSHIPS - PROJECT ASSESSMENT FORM ',
          date_string
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
                  'Recipient Name: '
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
                  'Vetting Summary'
                )
              ),
              React.createElement(
                'td',
                null,
                proj.documentPackage.notes.vet_summary
              )
            )
          )
        ),
        React.createElement(
          'h2',
          null,
          React.createElement(
            'b',
            null,
            'Work Items'
          )
        ),
        proj.workItems.map(function (workItem) {
          total_volunteers += workItem.volunteers_required;
          return React.createElement(
            'div',
            { className: 'workitem-total-container' },
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
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Site Comments'
                    ),
                    React.createElement(
                      'td',
                      null,
                      workItem.assessment_comments
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Volunteers Needed'
                    ),
                    React.createElement(
                      'td',
                      null,
                      workItem.volunteers_required
                    )
                  )
                )
              )
            ),
            React.createElement(
              'h4',
              null,
              'Materials List'
            ),
            workItem.materialsItems.map(function (materialsItem) {
              total_cost += materialsItem.price * materialsItem.quantity;
              return React.createElement(
                'div',
                { key: "wi-mi-" + materialsItem._id, className: 'materialsItem-container' },
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
                        'Description'
                      ),
                      React.createElement(
                        'td',
                        null,
                        materialsItem.description
                      )
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement(
                        'th',
                        null,
                        'Quantity'
                      ),
                      React.createElement(
                        'td',
                        null,
                        materialsItem.quantity
                      )
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement(
                        'th',
                        null,
                        'Price'
                      ),
                      React.createElement(
                        'td',
                        null,
                        materialsItem.price
                      )
                    ),
                    React.createElement(
                      'tr',
                      null,
                      React.createElement(
                        'th',
                        null,
                        'Total'
                      ),
                      React.createElement(
                        'td',
                        null,
                        '$',
                        materialsItem.price * materialsItem.quantity
                      )
                    )
                  )
                )
              );
            })
          );
        }),
        React.createElement(
          'h2',
          null,
          React.createElement(
            'b',
            null,
            'Hazard / Safety Testing'
          )
        ),
        React.createElement(
          'div',
          null,
          'Lead: ',
          proj.siteAssessment.lead
        ),
        React.createElement(
          'div',
          null,
          'Asbestos: ',
          proj.siteAssessment.asbestos
        ),
        React.createElement(
          'div',
          null,
          'Safety Plan: ',
          proj.siteAssessment.safety_plan
        ),
        React.createElement(
          'h2',
          null,
          React.createElement(
            'b',
            null,
            'Partners'
          )
        ),
        React.createElement(
          'div',
          { id: 'partners-container' },
          this.state.projectData.partners.map(function (partner) {
            return React.createElement(
              'div',
              { className: 'partner-container', key: partner._id },
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
                      'Organization'
                    ),
                    React.createElement(
                      'td',
                      null,
                      partner.org_name
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Address'
                    ),
                    React.createElement(
                      'td',
                      null,
                      partner.org_address
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Contact'
                    ),
                    React.createElement(
                      'td',
                      null,
                      partner.contact_name
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Email'
                    ),
                    React.createElement(
                      'td',
                      null,
                      partner.contact_email
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Phone'
                    ),
                    React.createElement(
                      'td',
                      null,
                      partner.contact_phone
                    )
                  )
                )
              )
            );
          })
        ),
        React.createElement(
          'div',
          null,
          'Total Cost Estimate: ',
          total_cost
        ),
        React.createElement(
          'div',
          null,
          'Total Volunteers Needed: ',
          total_volunteers
        )
      );
    }
  }]);

  return HandleitForm;
}(React.Component);

function loadReact() {
  $.ajax({
    url: "/app_project/projects/" + project_id,
    type: "GET",
    success: function success(data) {
      console.log(data);
      ReactDOM.render(React.createElement(HandleitForm, { projectData: data }), document.getElementById("pdf_container"));
    }
  });
}

loadReact();