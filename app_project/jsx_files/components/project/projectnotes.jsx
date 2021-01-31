class ProjectNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_notes: [],
    };
    this.get_notes();
  }

  get_notes = () => {
    funkie.get_notes(this.props.project_id, (data)=> {
      console.log(data);
    });
  };

  render() {
    return (<div>{this.props.project_id}</div>);
  }
}