class DeleteManagerApp extends React.Component {
  onClick_delAssessments = () => {
    $.ajax({
      type: "DELETE",
      url: "./delete_manager?command=delete_all_assessments",
      success: function(data, textStatus, xhr) {
        window.alert("done");
      }
    });
  }
  render() {
    return (
      <div>
        <button className="btn btn-primary" id="del-assessments-but">Delete</button> All Site Assessments, SA Work Items,Tool Rentals
      </div>
    );
  }
}

(function loadReact() {
  ReactDOM.render(<DeleteManagerApp />, document.getElementById("content-container"));
})()