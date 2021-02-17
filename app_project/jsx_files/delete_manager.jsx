class DeleteManagerApp extends React.Component {
  onClick_delAssessments = () => {
    $.ajax({
      type: "DELETE",
      url: "./delete_manager?command=delete_all_assessments",
      success: function(data, textStatus, xhr) {
        window.alert("done");
      }
    });
  };
  
  onClick_delete_all_projects = () => {
    var result = window.confirm("Are you sure you want to delete all projects?");
    if (result) {
      $.ajax({
        url: "./projects",
        type: "DELETE",
        success: function(data) {
          window.alert("All the projects were deleted");
        }
      })
    }
  };

  render() {
    return (
      <div>
        <div>
          <button className="btn btn-primary" id="del-assessments-but">Delete</button> All Site Assessments, SA Work Items,Tool Rentals
        </div>
        <div>
          <button type="button" onClick={this.onClick_delete_all_projects}>Delete Projects</button>
        </div>
      </div>
    );
  }
}

(function loadReact() {
  ReactDOM.render(<DeleteManagerApp />, document.getElementById("content-container"));
})()