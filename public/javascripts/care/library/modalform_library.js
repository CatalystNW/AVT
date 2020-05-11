var service_form_modal = {
  get_applicant(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "applications/" + app_id,
      success: function(app, textStatus, xhr) {
        if (xhr.status == 201 || xhr.status == 200) {
          callback(app);
        }
      }
    });
  },
  create_edit_button(app_id, service_id) {
    var edit_button,
        that = this;

    edit_button = $(`<button applicant_id=${app_id} service_id=${service_id} class='btn btn-sm btn-danger' type='button'>Edit</button>`);
    edit_button[0].setAttribute("data-toggle", "modal");
    edit_button[0].setAttribute("data-target", "#serviceModal");

    edit_button.on("click", function(e) {
      var service_id = $(this).attr("service_id"),
          app_id = $(this).attr("applicant_id");
      that.load_edit_service_modal_form(app_id, service_id);
    });

    return edit_button;
  },
  create_add_button(app_id) {
    var btn = document.createElement("button");
    btn.textContent = "Create Service";
    btn.setAttribute("value", app_id);
    btn.setAttribute("id", app_id + "-service-create-btn")
    btn.setAttribute("data-toggle", "modal");
    btn.setAttribute("data-target", "#serviceModal");

    var that = this;
    btn.addEventListener("click", function(e) {
      var app_id = e.target.value;
      that.load_add_service_modal_form(app_id);
    });
    btn.classList.add("btn", "btn-primary", "btn-sm");
    return btn;
  },

  load_edit_service_modal_form(app_id, service_id) {
    $("#service-form")[0].reset();

    $("#serviceForm-modalTitle").text("Edit Service");
    $("#service-form").attr("method", "PATCH");
    $("#service-form").attr("url", "./services/" + service_id);

    var that = this;

    this.get_applicant(app_id, function(applicant) {
      var services = applicant.services;
      for (var i=0; i< services.length; i++) {
        if (services[i]._id == service_id) {
          that.load_servicedata_to_modalform(services[i]);
          that.load_app_info_to_form(applicant);
        }
      }
    });
  },
  load_add_service_modal_form(app_id) {
    $("#service-form")[0].reset();
    
    // Set modal title (because modal used for editing services too)
    $("#serviceForm-modalTitle").text("Add Service");
    $("#service-form").attr("method", "POST");
    $("#service-form").attr("url", "./services");

    $("#service-app-id-input").val(app_id); // fill hidden input with app_id

    var that = this;

    this.get_applicant(app_id, function(applicant) {
      that.load_app_info_to_form(applicant);
    });
  },
  load_app_info_to_form(applicant) {
    $("#appInfo-serviceFormContainer").empty();
    var text = "Help Requested\n" + applicant.application.help_request + "\n\n";
    text += "Health Issues\n" + applicant.application.health_issues;
    $("#appInfo-serviceFormContainer").text(text);
  },
  load_servicedata_to_modalform(service) {
    $("#statusSelect").val(service.status);
    $("#description-input").val(service.description);
    $("#volunteer-input").val(service.volunteer);
    var date_time_string = service.service_date;

    var re_date = /(\d+)\/(\d+)\/(\d+)/;
    
    var date_result = re_date.exec(date_time_string);
    var year = date_result[3],
        month = (parseInt(date_result[1]) < 10) ? "0" + date_result[1] : date_result[1],
        day = (parseInt(date_result[2]) < 10) ? "0" + date_result[2] : date_result[2];

    var date_str = year + "-"+ month +"-"+ day + "T";
    var re_time = /(\d+):(\d+)/;
    var time_result = re_time.exec(date_time_string);
    if (date_time_string.includes("PM") && time_result[1] != "12")
      date_str += (parseInt(time_result[1]) + 12) + ":" + time_result[2];
    else {
      if (parseInt(time_result[1]) < 10)
        date_str += "0" + time_result[1] + ":" + time_result[2];
      else
        date_str += time_result[1] + ":" + time_result[2];
    }
    $("#service-date").val(date_str);
  },
};