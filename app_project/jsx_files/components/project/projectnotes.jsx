class ProjectNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_notes: [],
    };
    this.addNoteFormId = "add-note-form";
    this.get_notes();
  }

  get_notes = () => {
    funkie.get_notes(this.props.project_id, (data)=> {
      this.setState({
        project_notes: data,
      });
    });
  };

  getData = () => {
    var data = {};

    var formData = new FormData($("#" + this.addNoteFormId)[0]);
    console.log(formData);

    for (var key of formData.keys()) {
      data[key] = formData.get(key);
    }
    return data;
  }; 

  submitNote = (e) => {
    e.preventDefault();
    console.log(this.getData());
  };

  render() {
    return (
    <div>
      <form id={this.addNoteFormId} onSubmit={this.submitNote}>
        <textarea name="text"></textarea>
        <button type="submit">Submit</button>
      </form>
      <div>
        {this.state.project_notes.map((note)=> {
          return (<div>{note.text}</div>);
        })}
      </div>
    </div>);
  }
}