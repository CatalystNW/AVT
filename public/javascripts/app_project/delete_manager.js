window.onload = function() {
  var del_assessments_but = document.getElementById("del-assessments-but");
  del_assessments_but.addEventListener("click", function(e) {
    $.ajax({
      type: "DELETE",
      url: "./delete_manager?command=delete_all_assessments",
      success: function(data, textStatus, xhr) {
        console.log(data);
      }
    })
  });
}