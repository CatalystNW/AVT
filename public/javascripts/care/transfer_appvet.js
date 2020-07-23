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
    var apps = [];
    $("tbody input:checkbox:checked").each(function(index, ele) {
      apps.push(ele.value);
    });
    console.log(apps);
    $.ajax({
      type: "POST",
      url: "/carenetwork/transfer_appvets",
      contentType: 'application/json',
      data: JSON.stringify({
        app_ids: apps,
      }),
      success: function(data, textStatus, xhr) {
        // reload even if error
        location.reload();
      }
    });
  });
  // Clicking on header checkbox makes it all or none checked
  $("#header-check").on("change", function(e) {
    if ( $(this).prop("checked") ) {
      $("tbody input:checkbox").prop("checked", true).change();
    } else {
      $("tbody input:checkbox").prop("checked", false).change();
    }
  });
  // Changing checkbox will highlight row
  $("tbody input:checkbox").on("change", function(e) {
    var $ele = $(this);
    if ( $ele.prop("checked")) {
      $ele.parent().parent().parent().addClass("table-info");
    } else {
      $ele.parent().parent().parent().removeClass("table-info");
    }
  });
};

function get_query_parameters() {
  var option = $("#searchSelect").val();
  var query_string = `?search_option=${option}&`;
  // $("#startDateInput").val("");
  //     $("#endDateInput").val("");
  if (option == "app_date_range") {
    query_string += `start_date=${$("#startDateInput").val()}&end_date=${$("#endDateInput").val()}`
  } else {
    query_string += `search_value=${$("#search_input").val()}`
  }
  return query_string;
}

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

// UNUSED, BUT MIGHT BE USED IN THE FUTURE FOR MANIPULATION OF TABLE VIA FRONTEND JS
var appvet_obj = {
  applications: null,
  load_applications(applications) {
    this.applications = applications;
    this.load_new_table(this.applications);
  },
  load_new_table(apps) {
    var apps = this.applications;
    var $container = $("#app-row-container");
    $container.empty();
    for (var i=0; i<apps.length; i++) {
      $container.append(this.make_app_row(apps[i]));
    }
  },
  make_app_row(app) {
    console.log(app);
    var tr = $("<tr>");
    var td, div, a, input;

    // CHECKBOX
    td = $("<td>");
    
    if (app.care_network_transferred) {
      div = $("<div>✔️</div>");
    } else {
      div = $("<div>", {
        "class": "custom-control custom-checkbox"
      });
      input = $("<input>", {
        "type": "checkbox",
        "class": "form-check-input"
      });
      div.append(input);
    }
    
    td.append(div);
    tr.append(td);

    // NAME / LINK
    td = $("<td></td>");
    a = $("<a>", {
      "href": "/view/" + app._id,
      "target": "_blank",
      "text": `${app.application.name.first} ${app.application.name.middle} ${app.application.name.last}`
    });
    td.append(a);
    tr.append(td);

    // UPDATED DATE
    td = $("<td></td>", {
      text: app.updated
    });
    tr.append(td);

    // UPDATED STATUS
    td = $("<td></td>", {
      text: app.status
    });
    tr.append(td);

    // CREATED DATE
    td = $("<td></td>", {
      text: app.created
    });
    tr.append(td);

    // UPDATED App Name
    td = $("<td></td>", {
      text: app.app_name
    });
    tr.append(td);

    return tr;
  }
}