window.onload = function() {
  this.set_query_parameters();
  load_input_row(false);
  
  $("#searchSelect").on("change", function(e) {
    load_input_row(true);
  });

  $("#search-form").on("submit", function(e) {
    check_dates();
  });

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
};

// check if start & end dates are in correct order. If not, switch them.
function check_dates() {
  var start_date = $("#startDateInput").val(),
      end_date = $("#endDateInput").val();

  var start, end;
  if (start_date) {
    start = new Date(start_date);
  }
  if (end_date) {
    end = new Date(end_date);
  }

  if (start && end && start > end) {
    $("#startDateInput").val(end_date);
    $("#endDateInput").val(start_date);
  }
}

// Checks if there are query strings. If so, set the search parameters to that.
function set_query_parameters() {
  var url_parameters = new URLSearchParams(window.location.search);

  if (url_parameters.has('search_option')) {
    $("#searchSelect").val(url_parameters.get('search_option'));
  }

  if (url_parameters.has('search_value')) {
    $("#search_input").val(url_parameters.get('search_value'));
  }
  if (url_parameters.has('start_date')) {
    $("#startDateInput").val(url_parameters.get('start_date'));
  }
  if (url_parameters.has('end_date')) {
    $("#endDateInput").val(url_parameters.get('end_date'));
  }
}

function load_input_row(empty_inputs) {
  var option = $("#searchSelect").val();
  if (option == "app_date_range") {
    $("#dates-input-row").show();
    $("#text-input-row").hide();

    if (empty_inputs) {
      $("#startDateInput").val("");
      $("#endDateInput").val("");
    }
  } else {
    $("#dates-input-row").hide();
    $("#text-input-row").show();

    if (empty_inputs)
      $("#search_input").val("");
  }
}