window.onload = function() {
  this.toggle_card_headers();

  var completed_show_cmd = this.get_appstatus_show_status("completed");
  var completed_show_status = (completed_show_cmd == "show") ? true : false;

  $.ajax({
    type: "GET",
    url: "/carenetwork/applications?show_completed=" + completed_show_status,
    success: function(applicants, textStatus, xhr) {
      if (xhr.status == 200) {
        add_applications(applicants);
        console.log(applicants);
      }
    }
  });

  $(".card-header").on("click", click_card_header);
};

function add_applications(applicants) {
  for (var i=0; i<applicants.length; i++) {
    add_application(applicants[i]);
  }
}

function add_application(applicant) {
  var $container, $tr, name;
  $container = $("#" + applicant.application_status+ "_container");
  $tr = $("<tr></tr>");

  name = applicant.application.first_name;
  if (applicant.application.middle_name)
    name += " " + applicant.application.middle_name
  name += " " + applicant.application.last_name
  $tr.append($(`<td><a href=${applicant.self}>${name}</a></td>`));

  $tr.append($(`<td>${applicant.createdAt}</td>`));
  $tr.append($(`<td>${applicant.updatedAt}</td>`));
  $tr.append($(`<td>${applicant.reference}</td>`));
  $tr.append($(`<td>${applicant.services.length} <a href="${applicant.add_services_url}">Add</a></td>`));

  $container.append($tr);
}

// Iterate through all headers & check if show/hide
function toggle_card_headers() {
  var app_status;
  $(".card-header").each(function(index, ele) {
    app_status = $( this ).attr("value");
    toggle_card_header(app_status);
  });
}

function get_status_item_name(app_status) {
  return "CARE_show_" + app_status;
}

function click_card_header(e) {
  var app_status = $(this).attr("value");
  toggle_appstatus_show_status(app_status);
  toggle_card_header(app_status);
}

function toggle_appstatus_show_status(app_status) {
  var result = get_appstatus_show_status(app_status),
      item_name = get_status_item_name(app_status);
  
  var new_status = result == "show" ? "hide" : "show";

  window.localStorage.setItem(item_name, new_status);
  return new_status;
}

function get_appstatus_show_status(app_status) {
  var item_name = get_status_item_name(app_status);
  var result = window.localStorage.getItem(item_name);
  if (result === null || null === undefined)
    return "show";
  else
    return result;
}

function toggle_card_header(app_status) {
  var command = get_appstatus_show_status(app_status)
  var $table = $("#" + app_status + "_container"); // get table
  if (command == "hide")
    $table.parent().hide();
  else if (command == "show")
    $table.parent().show();
}