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
    $("#service-form").on("submit", function(e) {
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

var applicant_form_modal = {
  setup_form_handlers(app_id, edit_app_callback) {
    var $app_form = $("#application-form"),
      $note_form = $("#note-form");

    $app_form.off();
    $note_form.off();

    var that = this;

    $("#form-reset-button").click(event, function() {
      event.preventDefault();
      $app_form[0].reset();
      that.form_load_data(app_id);
    });
  
    $app_form.on("submit", function(e) {
      e.preventDefault();
  
      $.ajax({
        type: "PUT",
        url: "/carenetwork/applications/" + app_id,
        data: $app_form.serialize(),
        success: function(data, textStatus, xhr) {
          if (xhr.status == 200) {
            $("#applicantModal").modal("hide");
            $app_form[0].reset();
            if (edit_app_callback)
              edit_app_callback(data);
          }
        }
      });
    });

    $note_form.on("submit", function(e) {
      e.preventDefault();
  
      var formArr = $note_form.serializeArray();
      formArr.push({name: "application_id", value: app_id});
      that.submit_note(formArr);
    });
  },
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
      that.form_load_data(app_id);
      that.load_notes(app_id);
      that.setup_form_handlers(app_id, edit_app_callback)
    });
    return link;
  },
  form_load_data(app_id, callback) {
    var that = this;
    $.ajax({
      type: "GET",
        url: "/carenetwork/application/" + app_id,
        success: function(data, add_note_htmltextStatus, xhr) {
          if (xhr.status == 200) {
            that.fill_app_data(data)
          }
        },
        error: function(xhr, ajaxOptions, err) {
        }
    });
  },
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
      // } else if (field == "contacts") {
      //   for (field in app_data.contacts[0]) {
      //     $(`input[name=contact_${field}]`).val(app_data.contacts[0][field]);
      //   }
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
  load_notes(application_id) { 
    // Get Notes & Load
    var that = this;
    $.ajax({
      type: "GET",
      url: '/carenetwork/appnote/'+application_id,
      success: function(notes, textStatus, xhr) {
        var $container = $("#appnote-container");
        $container.empty();
  
        for (var i=0; i<notes.length; i++) {
          that.add_note_html(notes[i]);
        }
      }
    });
  },
  add_note_html(noteObj) {
    var $container = $("#appnote-container");
  
    var tr, note;
  
    tr = $('<tr></tr>');
    tr.append(`<td>${noteObj.date}</td>`);
    tr.append(`<td>${noteObj.note}</td>`);
    tr.append(`<td>${noteObj.name}</td>`);
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