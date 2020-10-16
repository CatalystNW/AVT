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

      that.submit_note();
    });
  },
  update_applicant_form(e) {
    var $app_form = $("#application-form"),
        app_id = applicant_form_modal.app_id;

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
    applicant_form_modal.app_id = null;
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
  submit_note() {
    var $note_form = $("#note-form");

    var formData = $note_form.serializeArray(),
        app_id = applicant_form_modal.app_id;

    formData.push({
      name: "application_id", 
      value: app_id});
        
    $.ajax({
      type: "POST",
      url: '/carenetwork/appnote',
      data: formData,
      success: function(note_data, textstatus, xhr) {
        if (xhr.status == 201 || xhr.status == 200) {
          $note_form[0].reset();

          // Show the note only if current app hasn't changed
          // due to delay between submitting note and closing (thus submit) the form
          if (applicant_form_modal.app_id == app_id)
            applicant_form_modal.add_note_html(note_data);
        }
      }
    });
  }
};