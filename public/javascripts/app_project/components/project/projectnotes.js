var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectNotes = function (_React$Component) {
  _inherits(ProjectNotes, _React$Component);

  function ProjectNotes(props) {
    _classCallCheck(this, ProjectNotes);

    var _this = _possibleConstructorReturn(this, (ProjectNotes.__proto__ || Object.getPrototypeOf(ProjectNotes)).call(this, props));

    _this.get_notes = function () {
      funkie.get_notes(_this.props.project_id, function (data) {
        _this.setState({
          project_notes: data
        });
      });
    };

    _this.getData = function () {
      var data = {};

      var formData = new FormData($("#" + _this.addNoteFormId)[0]);
      console.log(formData);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = formData.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          data[key] = formData.get(key);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return data;
    };

    _this.submitNote = function (e) {
      e.preventDefault();
      console.log(_this.getData());
    };

    _this.state = {
      project_notes: []
    };
    _this.addNoteFormId = "add-note-form";
    _this.get_notes();
    return _this;
  }

  _createClass(ProjectNotes, [{
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "form",
          { id: this.addNoteFormId, onSubmit: this.submitNote },
          React.createElement("textarea", { name: "text" }),
          React.createElement(
            "button",
            { type: "submit" },
            "Submit"
          )
        ),
        React.createElement(
          "div",
          null,
          this.state.project_notes.map(function (note) {
            return React.createElement(
              "div",
              null,
              note.text
            );
          })
        )
      );
    }
  }]);

  return ProjectNotes;
}(React.Component);