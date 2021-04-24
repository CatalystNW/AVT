export {ApplicationReport}

class ApplicationReport extends React.Component {
  searchForm = (e) => {
    e.preventDefault();
    
  }

  render() {
    return (<div>
      <form onSubmit={this.searchForm} id={this.formId}>
        <h3>Application Submit Date</h3>
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
    </div>)
  }
}