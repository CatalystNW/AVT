var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PAFApp = function (_React$Component) {
  _inherits(PAFApp, _React$Component);

  function PAFApp(props) {
    _classCallCheck(this, PAFApp);

    var _this = _possibleConstructorReturn(this, (PAFApp.__proto__ || Object.getPrototypeOf(PAFApp)).call(this, props));

    _this.hide_elements = function () {
      $('body').css('paddingTop', '0px');
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
    _this.hide_elements();
    return _this;
  }

  _createClass(PAFApp, [{
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
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
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
          return React.createElement(
            'div',
            { key: "wi-" + workItem._id, className: 'workitem-container' },
            React.createElement(
              'h3',
              null,
              'Work Item Name: ',
              workItem.name
            ),
            React.createElement(
              'div',
              null,
              'Description: ',
              workItem.description
            ),
            React.createElement(
              'div',
              null,
              'Site Comments: ',
              workItem.assessment_comments
            ),
            React.createElement(
              'h4',
              null,
              'Materials List'
            ),
            workItem.materialsItems.map(function (materialsItem) {
              return React.createElement(
                'div',
                { key: "wi-mi-" + materialsItem._id, className: 'materialsItem-container' },
                React.createElement(
                  'div',
                  null,
                  'Description: ',
                  materialsItem.description
                ),
                React.createElement(
                  'div',
                  null,
                  'Quantity: ',
                  materialsItem.quantity
                ),
                React.createElement(
                  'div',
                  null,
                  'Price: ',
                  materialsItem.price
                ),
                React.createElement(
                  'div',
                  null,
                  'Total: $',
                  materialsItem.price * materialsItem.quantity
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
          'Lead: '
        )
      );
    }
  }]);

  return PAFApp;
}(React.Component);

function loadReact() {
  $.ajax({
    url: "/app_project/projects/" + project_id,
    type: "GET",
    success: function success(data) {
      console.log(data);
      ReactDOM.render(React.createElement(PAFApp, { projectData: data }), document.getElementById("pdf_container"));
    }
  });
}

loadReact();