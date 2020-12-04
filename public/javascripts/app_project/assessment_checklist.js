class AssessmentChecklist extends React.Component {
  componentDidMount() {
    $('.dateinput').datepicker({
      format: 'yyyy-mm-dd',
    });
  }
  render() {
    return (
    <div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Start Date</label>
        <div className="col-sm-10">
          <input type="text" className="form-control dateinput" name="start_date" 
            placeholder="yyyy-mm-dd" id="checklist-start-date"></input>
        </div>
      </div>

      <div className="form-group row">
        <label className="col-sm-2 col-form-label">End Date</label>
        <div className="col-sm-10">
          <input type="text" className="form-control dateinput" name="end_date" 
            placeholder="yyyy-mm-dd" id="checklist-end-date"></input>
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