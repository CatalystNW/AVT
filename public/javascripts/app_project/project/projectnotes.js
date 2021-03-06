var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { ProjectNotes };

var ProjectNotes = function (_React$Component) {
  _inherits(ProjectNotes, _React$Component);

  function ProjectNotes(props) {
    _classCallCheck(this, ProjectNotes);

    var _this = _possibleConstructorReturn(this, (ProjectNotes.__proto__ || Object.getPrototypeOf(ProjectNotes)).call(this, props));

    _this.get_notes = function () {
      funkie.get_notes(_this.props.project_id, function (data) {
        data.notes.reverse();
        _this.setState({
          user_id: data.current_user_id,
          project_notes: data.notes
        });
      });
    };

    _this.getData = function (formId) {
      var data = {};

      var formData = new FormData($("#" + formId)[0]);

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
      var data = _this.getData(_this.addNoteFormId);
      $.ajax({
        url: "/app_project/projects/" + project_id + "/notes",
        type: "POST",
        context: _this,
        data: data,
        success: function success(note_data) {
          document.getElementById(this.addNoteFormId).reset();
          this.setState(function (state) {
            var new_notes = [note_data].concat(_toConsumableArray(state.project_notes));
            return {
              project_notes: new_notes
            };
          });
        }
      });
    };

    _this.deleteNote = function (e) {
      var note_id = e.target.getAttribute("note_id"),
          index = e.target.getAttribute("index");
      console.log(_this.state.project_notes[index]);
      var result = window.confirm("Are you sure you want to delete the project note?");
      if (result) {
        $.ajax({
          url: "/app_project/projects/" + _this.props.project_id + "/notes/" + note_id,
          type: "DELETE",
          context: _this,
          success: function success() {
            this.setState(function (state) {
              var new_notes = [].concat(_toConsumableArray(state.project_notes));
              new_notes.splice(index, 1);
              return { project_notes: new_notes };
            });
          }
        });
      }
    };

    _this.toggleEditNote = function (e) {
      if (!e || e.target.getAttribute('note_id') == -1) {
        _this.setState({
          edit_id: null
        });
      } else {
        _this.setState({
          edit_id: e.target.getAttribute('note_id')
        }, function () {
          // focus on new textarea
          var textarea = document.getElementById(_this.editTextareaId);
          textarea.focus();
        });
      }
    };

    _this.editNote = function (e) {
      e.preventDefault();
      var textarea = document.getElementById(_this.editTextareaId);
      var note_id = textarea.getAttribute("note_id"),
          index = textarea.getAttribute("index"),
          value = textarea.value;

      _this.toggleEditNote();
      $.ajax({
        url: "/app_project/projects/" + _this.props.project_id + "/notes/" + note_id,
        type: "PATCH",
        context: _this,
        data: {
          property: "text",
          value: value
        },
        success: function success() {
          this.setState(function (state) {
            var new_notes = [].concat(_toConsumableArray(state.project_notes));
            new_notes[index].text = value;
            return { project_notes: new_notes };
          });
        }
      });
    };

    _this.createNoteElement = function (note, index) {
      return React.createElement(
        "div",
        { key: note._id },
        React.createElement(
          "div",
          { className: "card" },
          React.createElement(
            "div",
            { className: "card-body" },
            React.createElement(
              "h5",
              { className: "card-title" },
              note.created_date
            ),
            React.createElement(
              "h6",
              { className: "card-subtitle mb-2 text-muted" },
              "By ",
              note.user_name
            ),
            // Set edit menu for the note
            _this.state.edit_id == note._id ? React.createElement(
              "div",
              { className: "card-text" },
              React.createElement(
                "form",
                { id: _this.editNoteFormId,
                  onSubmit: _this.editNote },
                React.createElement("textarea", { className: "form-control",
                  id: _this.editTextareaId,
                  note_id: note._id, index: index,
                  defaultValue: note.text }),
                React.createElement(
                  "button",
                  { type: "submit", className: "btn btn-sm" },
                  "Save"
                ),
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-sm",
                    onClick: _this.toggleEditNote, note_id: "-1" },
                  "Cancel"
                )
              )
            ) : React.createElement(
              "div",
              null,
              React.createElement(
                "p",
                { className: "card-text" },
                note.text
              ),
              _this.state.user_id == note.user_id ? React.createElement(
                "div",
                null,
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-sm btn-outline-primary",
                    note_id: note._id, index: index,
                    onClick: _this.toggleEditNote },
                  "Update"
                ),
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-sm btn-outline-danger",
                    note_id: note._id, index: index,
                    onClick: _this.deleteNote },
                  "Delete"
                )
              ) : null
            )
          )
        )
      );
    };

    _this.state = {
      project_notes: [],
      edit_id: null,
      user_id: null // ID of current user. Used to allow editing & deleting
    };
    _this.addNoteFormId = "add-note-form";
    _this.noteInputId = "add-note-textarea";
    _this.editNoteFormId = "edit-note-form";
    _this.editTextareaId = "edit-note-textarea";
    _this.get_notes();
    return _this;
  }

  _createClass(ProjectNotes, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "form",
          { id: this.addNoteFormId, onSubmit: this.submitNote },
          React.createElement(
            "div",
            { className: "form-group" },
            React.createElement(
              "h5",
              null,
              React.createElement(
                "label",
                { htmlFor: this.noteInputId },
                "Add Note"
              )
            ),
            React.createElement("textarea", { className: "form-control", name: "text", id: this.noteInputId, required: true })
          ),
          React.createElement(
            "button",
            { type: "submit", className: "btn btn-sm btn-outline-primary" },
            "Submit"
          )
        ),
        React.createElement("hr", null),
        React.createElement(
          "div",
          null,
          this.state.project_notes.map(function (note, index) {
            return _this2.createNoteElement(note, index);
          })
        )
      );
    }
  }]);

  return ProjectNotes;
}(React.Component);