class DeleteManagerApp extends React.Component {
  onClick_delAssessments = () => {
    var result = window.confirm("Are you sure you want to delete all assessments?");
    if (result) {
      $.ajax({
        type: "DELETE",
        url: "./delete_manager?command=delete_all_assessments",
        success: function(data, textStatus, xhr) {
          window.alert("done");
        }
      });
    }
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
        <p>
          Note: For development only. This page along with the delete controller needs to be
          disabled in production.
        </p>
        <div>
          <button className="btn btn-primary" onClick={this.onClick_delAssessments}
            id="del-assessments-but">Delete</button> All Site Assessments, Work Items, Materials List
        </div>
        <div>
          <button type="button" className="btn btn-primary"
            onClick={this.onClick_delete_all_projects}>Delete</button> Projects, Plan Wrapup checlists
        </div>
      </div>
    );
  }
}

(function loadReact() {
  ReactDOM.render(<DeleteManagerApp />, document.getElementById("content-container"));
})()