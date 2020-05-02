window.onload = function() {
  var app_id = $("#applicant_id_div").text();

  var $app_form = $("#application-form"),
      $note_form = $("#note-form");
  
  $("#form-reset-button").click(event, function() {
    event.preventDefault();
    $form[0].reset();
    form_load_data(app_id);
  });

  form_load_data(app_id);

  $app_form.on("submit", function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: window.location.href,
      data: $form.serialize(),
      success: function(data, textStatus, xhr) {
        if (xhr.status == 201) {
        }
      }
    });
  });

  $note_form.on("submit", function(e) {
    e.preventDefault();

    var formArr = $note_form.serializeArray();
    formArr.push({name: "application_id", value: app_id});
    submit_note(formArr);
  });

  load_notes(app_id);
};

function load_notes(application_id) { 
  // Get Notes & Load
  $.ajax({
    type: "GET",
    url: '/carenetwork/appnote/'+application_id,
    success: function(notes, textStatus, xhr) {
      var $container = $("#appnote-container");
      $container.empty();

      for (var i=0; i<notes.length; i++) {
        add_note_html(notes[i]);
      }
    }
  });
}

function add_note_html(noteObj) {
  var $container = $("#appnote-container");

  var tr, note;

  tr = $('<tr></tr>');
  tr.append(`<td>${noteObj.date}</td>`);
  tr.append(`<td>${noteObj.note}</td>`);
  tr.append(`<td>${noteObj.name}</td>`);
  $container.append(tr);
}

function submit_note(data) {
  var $note_form = $("#note-form");

  $.ajax({
    type: "POST",
    url: '/carenetwork/appnote',
    data: data,
    success: function(note_data, textstatus, xhr) {
      if (xhr.status == 201 || xhr.status == 200) {
        $note_form[0].reset();
        add_note_html(note_data);
      }
    }
  });
}

function form_load_data(app_id) {
  $.ajax({
    type: "GET",
      url: "/carenetwork/application/" + app_id,
      success: function(data, textStatus, xhr) {
        if (xhr.status == 200) {
          fill_app_data(data)
        }
      },
      error: function(xhr, ajaxOptions, err) {
      }
  });
}

// Fill out the inputs with data
function fill_app_data(data) {
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
}