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

var applicant_form_modal = {
  app_id: null,
  edit_app_callback: null,
  setup_form() {
    var $app_form = $("#application-form"),
        $note_form = $("#note-form");
    
    $app_form.off();
    $note_form.off();

    var that = this;

    $("#form-reset-button").click(function(event) {
      event.preventDefault();
      $app_form[0].reset();
      that.form_load_data();
    });

    // submit app form when user closes it
    $("#applicantModal").on("hidden.bs.modal", function(e) {
      that.update_applicant_form();
    });

    $note_form.on("submit", function(e) {
      e.preventDefault();
  
      var formArr = $note_form.serializeArray();
      formArr.push({name: "application_id", value: that.app_id});
      that.submit_note(formArr);
    });
  },
  update_applicant_form(e) {
    var $app_form = $("#application-form"),
        app_id = applicant_form_modal.app_id;

    console.log(app_id, $app_form);
    $.ajax({
      type: "PUT",
      url: "/carenetwork/applications/" + app_id,
      data: $app_form.serialize(),
      success: function(data, textStatus, xhr) {
        if (xhr.status == 200) {
          $app_form[0].reset();
          if (applicant_form_modal.edit_app_callback) {
            applicant_form_modal.edit_app_callback(data);
            applicant_form_modal.edit_app_callback = null;
          }
          applicant_form_modal.clear_form();
        }
      }
    });
  },
  set_appid_and_edit_callback(app_id, edit_app_callback) {
    this.app_id = app_id;
    this.edit_app_callback = edit_app_callback;
  },
  // Creates a link with a click handler that will open the application form modal
  create_link(app_id, name, edit_app_callback) {
    var link = $(`<a></a>`, {
      value: app_id,
      href: "",
      text: name,
      "data-target": "#applicantModal",
      "data-toggle": "modal",
    });
    var that = this;
    link.on("click", function(e) {
      var app_id = $(this).attr("value");
      $("#applicant_id_div").val(app_id);
      that.set_appid_and_edit_callback(app_id, edit_app_callback)
      that.form_load_data();
      that.load_notes();
      
    });
    return link;
  },
  clear_form() {
    $("#applicantModal").find('input').val('');
    $("#applicantModal").find('textarea').val('');
    $("#appnote-container").empty();
    console.log("Modal Form was closed");
  },
  // Send GET Request to get Application data & then loads to the form
  // via this.fill_app_data()
  form_load_data() {
    var that = this;
    $.ajax({
      type: "GET",
        url: "/carenetwork/applications/" + that.app_id,
        success: function(data, add_note_htmltextStatus, xhr) {
          if (xhr.status == 200) {
            that.fill_app_data(data);
          }
        },
        error: function(xhr, ajaxOptions, err) {
        }
    });
  },
  // Fill the applicant form/modal with data
  fill_app_data(data) {
    var field,
        app_data = data.application;
    // Fill out application_status select value
    if (data.application_status)
      $('[name=application_status]').val(data.application_status);
    else // Just in case status isn't given
      $('[name=application_status]').val("never_contacted");

    for (field in app_data) {
      if (field == "address") { // Set address
        for (field in app_data.address) {
          $(`input[name=${field}]`).val(app_data.address[field]);
        }
      } else if (field == "dob") {
        var regex = /(\d{4}-\d{2}-\d{2})/g
        var result = app_data[field].match(regex);
        if (result)
          $(`input[name=${field}]`).val(result[0]);
      } else if (field == "marital_status") {
        $(`:radio[value=${app_data[field]}]`,).prop('checked', true);
      } else {
        $(`input[name=${field}]`, ).val(app_data[field]);
        // Set text area for some fields
        $(`textarea[name=${field}]`, ).val(app_data[field]);
      }
    }
  },
  load_notes() { 
    // Get Notes & Load
    var that = this;
    $.ajax({
      type: "GET",
      url: '/carenetwork/appnote/'+ that.app_id,
      success: function(notes, textStatus, xhr) {
        var $container = $("#appnote-container");
        $container.empty();
  
        for (var i=0; i<notes.length; i++) {
          that.add_note_html(notes[i]);
        }
      }
    });
  },
  click_appnote_edit_btn(e) {
    var note_id = $(this).val();
    var btn_text = $(this).text();
    var td = $(`#${note_id}_text`);

    if (btn_text == "Edit") {
      $(this).text("Submit");
      let note_text = td.text();
      td.empty();
      td.append($("<textarea>", {
        style: "width: 100%;",
        id: `${note_id}_textarea`,
        text: note_text
      }));
    } else if (btn_text == "Submit") {
      $(this).text("Edit");

      let textarea = $(`#${note_id}_textarea`),
          note_text = textarea.val();
      textarea.parent().empty();
      
      $.ajax({
        type: "PUT",
        url: "/carenetwork/appnote/" + note_id,
        data: {
          "note_text": note_text
        },
        success: function(appnote, textStatus, xhr) {
          td.empty();
          if (xhr.status == 200) {
            td.text(appnote.note);
            $("#" + appnote._id + "_" + "date").text(appnote.updatedAt);
          } else {
            td.text(note_text);
          }
        },
        error: function(xhr, textStatus, err) {
          td.empty();
          td.text(note_text);
          window.alert("An error occurred.");
        }
      })
    } else {
      $(this).text("Edit");
    }
  },
  add_note_html(noteObj) {
    var $container = $("#appnote-container");
  
    var tr = $('<tr></tr>');
    tr.append( $("<td>", {
      text: noteObj.updatedAt,
      id: noteObj._id + "_" + "date"
    }));

    tr.append($("<td>", {
      "text": noteObj.note,
      "id": noteObj._id + "_" + "text"
    }));
    tr.append(`<td>${noteObj.name}</td>`);
    var td = $("<td>");
    if (noteObj.editable) {
      var button = $("<button>", {
        "type": "button",
        "class": "btn btn-primary",
        "value": noteObj._id,
        "text": "Edit"
      });
      button.on("click", this.click_appnote_edit_btn);
      td.append(button);
    }
      
    tr.append(td);
    $container.append(tr);
  },
  submit_note(data) {
    var $note_form = $("#note-form"),
        that = this;
  
    $.ajax({
      type: "POST",
      url: '/carenetwork/appnote',
      data: data,
      success: function(note_data, textstatus, xhr) {
        if (xhr.status == 201 || xhr.status == 200) {
          $note_form[0].reset();
          that.add_note_html(note_data);
        }
      }
    });
  }
};