window.onload = function() {
  services_handler.load();
};

var services_handler = {
  load() {
    this.add_notesubmit_handler();
    this.add_change_status_handler();
    this.add_print_btn_handler();
    this.fill_notes();
    this.load_status();
    
  },
  add_print_btn_handler() {
    $("#print-btn").on("click", this.print_btn_handler);
  },
  modify_page_for_print() {
    // Remove scroll bar from notes for printing & padding in card
    var $note_container = $("#notes-container");
    $note_container.addClass("print");
    $note_container.removeClass("scrollbox");

    $(".card-header").each(function(index, element) {
      $(element).addClass("printbox");
    });

    $(".card-body").each(function(index, element) {
      $(element).addClass("printbox");
    });
  },
  restore_page_after_print() {
    // Place back scroll bars & padding in card
    $note_container.removeClass("print");
    $note_container.addClass("scrollbox");

    $(".card-header").each(function(index, element) {
      $(element).removeClass("printbox");
    });
    $(".card-body").each(function(index, element) {
      $(element).removeClass("printbox");
    });
  },
  print_btn_handler(e) {
    services_handler.modify_page_for_print();

    // Make 3 columns into 1 for printing
    var div1 = $("#first-container"),
        div2 = $("#second-container"),
        div3 = $("third-container");

    var div1_class = div1.attr("class"),
        div2_class = div2.attr("class"),
        div3_class = div3.attr("class");

    div1.removeClass();
    div2.removeClass();
    div3.removeClass();

    window.print();

    // restore back to 3 columns
    div1.attr("class", div1_class);
    div2.attr("class", div2_class);
    div3.attr("class", div3_class);
    
    services_handler.restore_page_after_print();
  },
  add_note(note, date) {
    var div = $('<div class="noteDiv"></div>');
    div.text( date + "\n" + note + "\n" );
    $("#notes-container").append(div);
  },
  add_notesubmit_handler() {
    $("#noteForm").on("submit", function(e) {
      e.preventDefault();
  
      var service_id = $("input[name='service_id']").val();
  
      $.ajax({
        type: "POST",
        url: `../services/${service_id}/notes`,
        data: $(this).serialize(),
        success: function(note, textStatus, xhr) {
          if (xhr.status == 201 || xhr.status == 200) {
            $("#noteModal").modal("hide");
            $("#noteForm")[0].reset();
            services_handler.add_note(note.note, note.createdAt);
          }
        }
      });
    });
  },
  fill_notes() {
    var service_id = $("input[name='service_id']").val();
    $.ajax({
      type: "GET",
      url: `../services/${service_id}/notes`,
      data: $(this).serialize(),
      success: function(notes, textStatus, xhr) {
        for (var i=0; i<notes.length; i++) {
          services_handler.add_note(notes[i].note, notes[i].createdAt);
        }
      }
    })
  },
  // Load the value in select:status given by hbs to select the right option
  load_status() {
    var value = $("#statusSelect").attr("value");

    $(`option[value='${value}']`).attr("selected", "selected");
  },
  add_change_status_handler() {
    $("#statusSelect").on("change", function(e) {
      var new_value = $("#statusSelect").val();

      $("#statusSelect").attr("disabled", "disabled");

      var service_id = $("input[name='service_id']").val();

      $.ajax({
        type: "PATCH",
        url: `../services/${service_id}`,
        data: {"status": new_value, },
        success: function(service, textStatus, xhr) {
          if (xhr.status == 200) {
            $("#statusSelect").removeAttr("disabled");
          }
        }
      })
    });
  }
}