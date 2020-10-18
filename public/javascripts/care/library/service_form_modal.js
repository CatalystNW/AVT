// Modal that shows the add/update service form
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
    setup_form(callback) {
      this.add_hours();
      this.add_minutes();
  
      $("#service-form").on("submit", function(e) {
  
        var date_string = $("#service-select-day").val() + "T";
  
        var hour = $("#service-select-hour").val(),
            period = $("#service-select-period").val();
  
        if (period == "AM" && hour == 12) {
          date_string += "00:"
        } else {
          if (period == "PM") {
            if (hour == 12)
              hour = 0;
            hour = parseInt(hour) + 12;
          }
          if (hour < 10)
            date_string += "0" + hour + ":";
          else
            date_string += hour + ":";
        }
  
        var minute = $("#service-select-minute").val();
  
        if (minute < 10)
          date_string += "0" + minute
        else
          date_string += minute;
        // hidden date input the service form modal
        $("#service-date").val(date_string);
  
        var method = $(this).attr("method");
        e.preventDefault();
        $.ajax({
          type: method,
          url: $(this).attr("url"),
          data: $(this).serialize(),
          success: function(service, textStatus, xhr) {
            if (xhr.status == 201 || xhr.status == 200) {
              $("#serviceModal").modal("hide");
              $("#service-form")[0].reset();
              
              callback(method, service);
            }
          }
        });
      });
    },
    add_hours() {
      // add hours to hour select
      var $select =$("#service-select-hour");
  
      var option, text;
      for (var i=1; i<13; i++) {
        if (i < 10)
          text = "0" + i;
        else
          text = i;
        option = $("<option>", {
          "text": text,
          "value": i
        });
        $select.append(option);
      }
    },
    add_minutes() {
      // add minutes to minute select
      var $select =$("#service-select-minute");
  
      var option, text;
      for (var i=0; i<60; i++) {
        if (i < 10)
          text = "0" + i;
        else
          text = i;
        option = $("<option>", {
          "text": text,
          "value": i
        });
        $select.append(option);
      }
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
    // set form to edit status with url & action
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
    // Load the applicant info to the left side of the modal
    load_app_info_to_form(applicant) {
      var container = $("#appInfo-serviceFormContainer");
      container.empty();
  
      var name = applicant.application.first_name;
      if (applicant.application.middle_name)
        name += " " + applicant.application.middle_name
      name += " " + applicant.application.last_name
      container.append($("<p></p>").text("Name\n" + name));
  
      var address = applicant.application.address.line_1 + "\n";
      if (applicant.application.address.line_2)
        address += applicant.application.address.line_2 + "\n";
      address += applicant.application.address.city + ",";
      address += applicant.application.address.state + " ";
      address += applicant.application.address.zip + ",";
      container.append($("<p></p>").text("Address\n" + address));
  
      container.append($("<p></p>").text("Help Requested\n" + applicant.application.help_request));
      container.append($("<p></p>").text("Health Issues\n" + applicant.application.health_issues));
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
  
      var date_str = year + "-"+ month +"-"+ day;
      var period;
      $("#service-select-day").val(date_str);
  
      var re_time = /(\d+):(\d+)/;
      var time_result = re_time.exec(date_time_string);
      var hour = parseInt(time_result[1]),
          minute = parseInt(time_result[2]);
  
      
      $("#service-select-hour").val(hour);
      $("#service-select-minute").val(minute);
  
      if (date_time_string.includes("PM")) {
        period = "PM"
      } else
        period = "AM";
      
      $("#service-select-period").val(period);
    },
  };