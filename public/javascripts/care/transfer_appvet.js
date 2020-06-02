window.onload = function() {
  $(".transfer-btn").on("click", function (e) {
    var app_id = $(this).attr("value");
    $.ajax({
      type: "POST",
      url: "/carenetwork/transfer_appvet",
      data: {
        applicant_id: app_id
      },
      success: function(data, textStatus, xhr) {
        // reload even if error
        location.reload();
      }
    });
  });

  this.set_query_parameters();
};

// Checks if there are query strings. If so, set the search parameters to that.
function set_query_parameters() {
  var url_parameters = new URLSearchParams(window.location.search);

  if (url_parameters.has('search_option')) {
    $("#yearSelect").val(url_parameters.get('search_option'));
  }

  if (url_parameters.has('search_value')) {
    $("#search_input").val(url_parameters.get('search_value'));
  }
}