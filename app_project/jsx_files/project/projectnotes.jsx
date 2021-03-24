export { ProjectNotes }

class ProjectNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_notes: [],
      edit_id: null,
      user_id: null, // ID of current user. Used to allow editing & deleting
    };
    this.addNoteFormId = "add-note-form";
    this.noteInputId = "add-note-textarea";
    this.editNoteFormId = "edit-note-form";
    this.editTextareaId = "edit-note-textarea";
    this.get_notes();
  }

  get_notes = () => {
    funkie.get_notes(this.props.project_id, (data)=> {
      data.notes.reverse();
      this.setState({
        user_id: data.current_user_id,
        project_notes: data.notes,
      });
    });
  };

  getData = (formId) => {
    var data = {};

    var formData = new FormData($("#" + formId)[0]);

    for (var key of formData.keys()) {
      data[key] = formData.get(key);
    }
    return data;
  }; 

  submitNote = (e) => {
    e.preventDefault();
    var data = this.getData(this.addNoteFormId);
    $.ajax({
      url: "/app_project/projects/" + project_id + "/notes",
      type: "POST",
      context: this,
      data: data,
      success: function(note_data) {
        document.getElementById(this.addNoteFormId).reset();
        this.setState(state => {
          var new_notes  = [note_data, ...state.project_notes];
          return {
            project_notes: new_notes,
          };
        });
      },
    });
  };

  deleteNote = (e) => {
    const note_id = e.target.getAttribute("note_id"),
          index = e.target.getAttribute("index");
    console.log(this.state.project_notes[index]);
    const result = window.confirm(`Are you sure you want to delete the project note?`);
    if (result ) {
      $.ajax({
        url: "/app_project/projects/" + this.props.project_id + "/notes/" + note_id,
        type: "DELETE",
        context: this,
        success: function() {
          this.setState(state => {
            var new_notes = [...state.project_notes];
            new_notes.splice(index,1);
            return {project_notes: new_notes};
          });
        }
      });
    }
  };

  toggleEditNote = (e) => {
    if (!e || e.target.getAttribute('note_id') == -1) {
      this.setState({
        edit_id: null,
      });
    } else {
      this.setState({
        edit_id: e.target.getAttribute('note_id'),
      }, () => { // focus on new textarea
        const textarea = document.getElementById(this.editTextareaId);
        textarea.focus();
      });
    }
  };

  editNote = (e) => {
    e.preventDefault();
    const textarea = document.getElementById(this.editTextareaId);
    const note_id = textarea.getAttribute("note_id"),
          index = textarea.getAttribute("index"),
          value = textarea.value;

    this.toggleEditNote();
    $.ajax({
      url: "/app_project/projects/" + this.props.project_id + "/notes/" + note_id,
      type: "PATCH",
      context: this,
      data: {
        property: "text",
        value: value,
      },
      success: function() {
        this.setState(state => {
          var new_notes = [...state.project_notes];
          new_notes[index].text = value;
          return {project_notes: new_notes};
        });
      }
    });
  }

  createNoteElement = (note, index) => {
    return (
      <div key={note._id}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              {note.created_date}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              By {note.user_name}
            </h6>
            {// Set edit menu for the note
              (this.state.edit_id == note._id) ?
              (<div className="card-text">
                <form id={this.editNoteFormId}
                  onSubmit={this.editNote}>
                  <textarea className="form-control"
                    id={this.editTextareaId}
                    note_id={note._id} index={index}
                    defaultValue={note.text}></textarea>
                  <button type="submit" className="btn btn-sm">
                    Save
                  </button>
                  <button type="button" className="btn btn-sm"
                    onClick={this.toggleEditNote} note_id="-1">
                    Cancel
                  </button>
                </form>
              </div>) :
              (
                <div>
                  <p className="card-text">
                    {note.text}
                  </p>
                  {
                    this.state.user_id == note.user_id ?
                    (<div>
                      <button type="button" className="btn btn-sm btn-outline-primary"
                        note_id={note._id} index={index}
                        onClick={this.toggleEditNote}>Update</button>
                      <button type="button" className="btn btn-sm btn-outline-danger"
                        note_id={note._id} index={index}
                        onClick={this.deleteNote}>Delete</button>    
                    </div>) : null
                  }
                </div>
              )
            }
          </div>
        </div>
      </div>);
  }

  render() {
    return (
    <div>
      <form id={this.addNoteFormId} onSubmit={this.submitNote}>
        <div className="form-group">
          <h5>
            <label htmlFor={this.noteInputId}>Add Note</label>
          </h5>
          <textarea className="form-control" name="text" id={this.noteInputId} required></textarea>
        </div>
        
        <button type="submit" className="btn btn-sm btn-outline-primary">Submit</button>
      </form>
      <hr></hr>
      <div>
        {this.state.project_notes.map((note, index)=> {
          return this.createNoteElement(note, index);
        })}
      </div>
    </div>);
  }
}