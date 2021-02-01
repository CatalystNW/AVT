class ProjectNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_notes: [],
    };
    this.addNoteFormId = "add-note-form";
    this.noteInputId = "add-note-textarea";
    this.get_notes();
  }

  get_notes = () => {
    funkie.get_notes(this.props.project_id, (data)=> {
      data.reverse();
      this.setState({
        project_notes: data,
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
    
    const result = window.confirm(`Are you sure you want to delete project note ${this.state.project_notes[index].name}?`);
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

  render() {
    return (
    <div>
      <form id={this.addNoteFormId} onSubmit={this.submitNote}>
        <div className="form-group">
          <label htmlFor={this.noteInputId}>Project Note</label>
        <textarea className="form-control" name="text" id={this.noteInputId} required></textarea>
        </div>
        
        <button type="submit">Submit</button>
      </form>
      <div>
        {this.state.project_notes.map((note, index)=> {
          return (
            <div key={note._id}>
              {note.text}
              <button type="button" className="btn btn-sm"
                note_id={note._id} index={index}
                onClick={this.deleteNote}>Delete</button>
            </div>);
        })}
      </div>
    </div>);
  }
}