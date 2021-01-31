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
        {this.state.project_notes.map((note)=> {
          return (<div key={note._id}>{note.text}</div>);
        })}
      </div>
    </div>);
  }
}