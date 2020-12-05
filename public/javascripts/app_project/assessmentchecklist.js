class AssessmentChecklist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  load_assessment(assessment) {
    this.setState(assessment)
  }
  componentDidMount =() => {
    $('.checklist-dateinput').datepicker({
      format: 'yyyy-mm-dd',
    }).on("hide", (e) => this.onHide_date(e));
  }

  onHide_date(e) {
    var name = e.target.getAttribute("name"),
        value = e.target.value;

    if (name == "project_start_date" && value) {
      var regex = /(\d{4})-(\d{2})-(\d{2})/g;
      var result = regex.exec(value);
      if (result) {
        console.log(result);
        funkie.edit_site_assessment({
          assessment_id: this.state._id,
          property: name,
          year: result[1],
          month: result[2],
          day: result[3],
        });
      }
    } else if (name == "project_end_date") {
      ;
    }
  }

  render() {
    var hours = [],
        i;
    for(i=1; i<13;i++) {
      hours.push([
        <option key={"hour-"+i} value={i}>{i >= 10 ? String(i) : "0" + String(i)}</option>
      ]);
    }
    var minutes = [];
    for(i=1; i<61;i++) {
      minutes.push([
        <option key={"min-"+i} value={i}>{i >= 10 ? String(i) : "0" + String(i)}</option>
      ]);
    }
    return (
    <div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Start Date</label>
        <div className="col-sm-10">
          <input type="text" className="form-control checklist-dateinput" name="project_start_date" 
            placeholder="yyyy-mm-dd" id="checklist-start-date" onChange={this.onChange_start_date}></input>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Start Time</label>
        <div className="col-sm-10">
          <div className="form-inline">
            <select className="form-control">
              {hours}
            </select>
            <select className="form-control">
              {minutes}
            </select>
            <select className="form-control">
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">End Date</label>
        <div className="col-sm-10">
          <input type="text" className="form-control checklist-dateinput" name="project_end_date" 
            placeholder="yyyy-mm-dd" id="checklist-end-date"></input>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">End Time</label>
        <div className="col-sm-10">
          <div className="form-inline">
            <select className="form-control">
              {hours}
            </select>
            <select className="form-control">
              {minutes}
            </select>
            <select className="form-control">
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Lead</label>
        <div className="col-sm-10">
          <select className="form-control">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Asbestos</label>
        <div className="col-sm-10">
          <select className="form-control">
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Safety Plan</label>
        <div className="col-sm-10">
          <textarea className="form-control" rows='4'></textarea>
        </div>
      </div>

      <div className="form-group">
        <label>
          Tools/Rentals
          <button type="button" className="btn btn-sm">Create</button>
        </label>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Cost</th>
              <th scope="col">Vendor</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>#Cost</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="form-group">
        <label>
          Other Costs
          <button type="button" className="btn btn-sm">Create</button>
        </label>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Cost</th>
              <th scope="col">Vendor</th>
              <th scope="col">Options</th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>#Cost</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="form-group">
        <label>Porta Potty</label>
        <div className="col form-check">
          <label>Required </label>
          <input type="checkbox" />
        </div>
        <div className="col">
          <label>Cost</label>
          <input type="number" className="form-control" min="0" step="0.01"></input>
        </div>
      </div>

      <div className="form-group">
        <label>Waste/Dump Trailer</label>
        <div className="col form-check">
          <label>Required </label>
          <input type="checkbox" />
        </div>
        <div className="col">
          <label>Cost</label>
          <input type="number" className="form-control" min="0" step="0.01"></input>
        </div>
      </div>
    </div>);
  }
}