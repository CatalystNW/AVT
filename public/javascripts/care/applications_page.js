window.onload = function() {
  $.ajax({
    type: "GET",
    url: "/carenetwork/applications",
    success: function(applicants, textStatus, xhr) {
      if (xhr.status == 200) {
        add_applications(applicants);
      }
    }
  })
};

function add_applications(applicants) {
  var $container, $tr, name, app;
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

  $container.append($tr);
}