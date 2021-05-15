var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { DocStatusBar };

var DocStatusBar = function (_React$Component) {
  _inherits(DocStatusBar, _React$Component);

  function DocStatusBar(props) {
    _classCallCheck(this, DocStatusBar);

    var _this = _possibleConstructorReturn(this, (DocStatusBar.__proto__ || Object.getPrototypeOf(DocStatusBar)).call(this, props));

    _this.onChangeStatus = function (e) {
      $.ajax({
        url: "/app_project/document/" + _this.props.appId + "/status",
        type: "PATCH",
        context: _this,
        data: {
          applicationStatus: e.target.value
        },
        success: function success(data) {
          this.setState({
            applicationStatus: e.target.value
          });
        },
        error: function error() {
          window.alert("Unrecognized application status. \n                      Please contact the adminstrator with the status attempted.");
        }
      });
    };

    _this.createSelect = function () {
      var values = {
        'discuss': { value: 'discuss', text: 'On Hold - Pending Discussion' },
        'new': { value: 'new', text: 'NEW' },
        'phone': { value: 'phone', text: 'Phone Call Needed' },
        'handle': { value: 'handle', text: 'Handle-It' },
        'documents': { value: 'documents', text: 'Awaiting Documents' },
        'assess': { value: 'assess', text: 'Site Assessment - Pending' },
        'assessComp': { value: 'assessComp', text: 'Site Assessment - Complete', noneditable: true },
        'approval': { value: 'approval', text: 'Application Approval Process' },
        'declined': { value: 'declined', text: 'Declined' },
        'withdrawnooa': { value: 'withdrawnooa', text: 'Withdrawn - Outside Service Area' },
        'withdrawn': { value: 'withdrawn', text: 'Withdrawn' },
        'project': { value: 'project', text: 'Approved Project' },
        'waitlist': { value: 'waitlist', text: 'Waitlist' },
        'transferred': { value: 'transferred', text: 'Transferred' }
      };
      var status = _this.state.applicationStatus;
      if (values[status].noneditable) {
        return React.createElement(
          "span",
          null,
          values[status].text
        );
      } else if (!(status in values)) {
        return React.createElement(
          "span",
          null,
          status
        );
      }
      var options = [];
      for (var key in values) {
        if (!("noneditable" in values[key]) || !values[key].noneditable) {
          options.push(React.createElement(
            "option",
            { value: key, key: key },
            values[key].text
          ));
        }
      }
      return React.createElement(
        "select",
        { className: "form-control", value: _this.state.applicationStatus,
          onChange: _this.onChangeStatus },
        options
      );
    };

    _this.state = {
      applicationStatus: _this.props.applicationStatus
    };
    return _this;
  }

  _createClass(DocStatusBar, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "h4",
          null,
          "Status"
        ),
        this.createSelect()
      );
    }
  }]);

  return DocStatusBar;
}(React.Component);