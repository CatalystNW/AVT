export { ProjectReport }

class ProjectReport extends React.Component {
  constructor(props) {
    super(props);
    this.formId = "project-form";
    this.state = {
      projects: [],
    }
  }

  componentDidMount() {
    $(".datepicker").datepicker({
      orientation: 'bottom',
      format: 'yyyy-mm-dd',
    });
  }

  get_data = () => {
    var data = {};
    var formData = new FormData($("#" + this.formId)[0]);

    for (var key of formData.keys()) {
      data[key] = formData.get(key);
    }
    return data;
  }

  searchForm = (e) => {
    e.preventDefault();
    this.get_data();
    $.ajax({
      url: "/app_project/report/project",
      type: "POST",
      data: this.get_data(),
      context: this,
      success: function(projects) {
        console.log(projects);
        this.setState({
          projects: projects,
        });
      }
    });
  };

  createPartnersTable = () => {
    const partnersDict = {};
    this.state.projects.forEach(project => {
      project.partners.forEach(partner => {
        if (partner.org_name in partnersDict) {
          partnersDict[partner.org_name] += 1;
        } else {
          partnersDict[partner.org_name] = 0;
        }
      })
    });

    const partnersArray = [];
    let tr;
    for (let name in partnersDict) {
      partnersArray.push(
        (<tr key={"part-" + name}>
          <td>{name}</td>
          <td>{partnersDict[name]}</td>
        </tr>)
      );
    }

    return (
    <div>
      <h2>Partners</h2>
      <table className="table table-sm">
        <thead>
          <tr>
            <th scope="col">Partner</th>
            <th scope="col">Number of Projects</th>
          </tr>
        </thead>
        <tbody>
          {partnersArray}
        </tbody>
      </table>
    </div>)
  };

  render() {
    return (
    <div>
      <form onSubmit={this.searchForm} id={this.formId}>
        <h3>Start Date</h3>
        <div className="form-group row">
          <div className="col-md-3">
            <label>Start</label>  
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="startDate"></input>
          </div>
          <div className="col-md-3">
            <label>End</label>
            <input type="text" className="datepicker form-control"
              placeholder="yyyy-mm-dd" name="endDate"></input>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {this.createPartnersTable()}
    </div>);
  }
}