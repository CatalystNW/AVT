export { SearchReport }

import { functionHelper } from "./functionHelper.js"

class SearchReport extends React.Component {
  constructor(props) {
    super(props);
    this.searchFormId = "search-applications-form";
  }

  searchForm = (e) => {
    e.preventDefault();
    console.log(functionHelper.get_data(this.searchFormId));
    $.ajax({
      url: "/app_project/report/search_applications",
      type: "POST",
      data: functionHelper.get_data(this.searchFormId),
      context: this,
      success: function(applications) {
        console.log(applications);
      }
    });
  };

  createForm = () => {
    return (
      <form id={this.searchFormId} onSubmit={this.searchForm}>
        <h3>Application Info</h3>
        <div className="form-row">
          <div className="form-group col-sm-6 col-md-3">
            <label>First Name</label>
            <input className="form-control" type="text" name="first_name"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Last Name</label>
            <input className="form-control" type="text" name="last_name"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>City</label>
            <input className="form-control" type="text" name="city"></input>    
          </div>
          <div className="form-group col-sm-6 col-md-3">
            <label>Zip Code</label>
            <input className="form-control" type="text" name="zip"></input>    
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>)
  }

  render() {
    return (<div>
      {this.createForm()}
    </div>)
  }
}