window.onload = function() {
  this.card_tabler.start("view_services", 
    function click_callback(app_status, result) {
      if (app_status == "complete" && result == "show" && 
        $("#complete_container").children().length == 0)
        service_obj.get_services(); // Load app data to include complete apps
    }
  );
  this.service_obj.get_services();

  service_form_modal.setup_form(
    (method, service) => {
      if (method == "POST") {
        ;
      } else { // Edited Form
        services_table.update_service_row(service);
      }
    }
  );
};

var service_obj = {
  get_services() {
    var complete_show_cmd = card_tabler.get_appstatus_show_status("complete");
    var complete_show_status = (complete_show_cmd == "show") ? true : false;

    $.ajax({
      type: "GET",
      url: "/carenetwork/services?show_complete=" + complete_show_status,
      success: function(servicesData, textStatus, xhr) {
        if (xhr.status == 201 || xhr.status == 200) {
          services_table.add_service_rows(servicesData);
        }
      }
    });
  },
};

var services_table = {
  get_id(service_id) {
    return service_id + "-service-tr";
  },
  update_service_row(service) {
    var id = this.get_id(service._id);

    // Get app reference from old row: since only app_id is passed in service.applicant
    var $old_tr = $("#" + id);
    var old_tr_children = $old_tr[0].childNodes,
        text;

    var app_ref;
    for (var i=0; i<old_tr_children.length; i++) {
      text = old_tr_children[i].textContent;
      if (text.includes("CARE-")) {
        app_ref = text;
        break;
      }
    }
    // Get status from the card head to check if it changes after update
    var card_body = $old_tr.parents().eq(2),
        card_head = card_body.prev();
    var old_status = card_head.attr("value");

    var new_tr = this.make_service_row(service, app_ref);
    if (old_status == service.status)
      $old_tr.replaceWith(new_tr);
    else {
      $old_tr.remove();
      var tbody_id = this.get_tbody_id(service.status);
    
      $("#" + tbody_id).append(new_tr);
    }
  },
  get_tbody_id(app_status) {
    return app_status + "_container";
  },
  add_service_rows(servicesData) {
    this.empty_services();

    for(var  i=0; i<servicesData.length; i++) {
      this.add_service_row(servicesData[i]);
    }
  },
  add_service_row(serviceData) {
    var tbody_id = this.get_tbody_id(serviceData.status);
    
    var $tr = this.make_service_row(serviceData);
    $("#" + tbody_id).append($tr);
  },
  make_service_row(serviceData, applicant_reference) {
    // If applicant_reference is defined
    // then serviceData.applicant is only a string (not obj)
    if (!applicant_reference) {
      var app_id = serviceData.applicant._id;
      applicant_reference = serviceData.applicant.reference;
    } else {
      var app_id = serviceData.applicant;
    }
    var service_id = serviceData._id;
    var edit_btn = service_form_modal.create_edit_button(app_id, service_id);

    var $tr = $("<tr></tr>", {
      "id": this.get_id(service_id)
    });

    $tr.append( $(`<td>${serviceData.service_date}</td>`) );
    $tr.append( $(`<td>${serviceData.status}</td>`));
    $tr.append( $(`<td>${serviceData.volunteer}</td>`));
    $tr.append( $(`<td>${applicant_reference}</td>`));
    $tr.append( $(`<td>${serviceData.createdAt}</td>`));
    var option_td = $(`<td><a href='view_service/${service_id}'>View</a></td>`);
    option_td.append(edit_btn);
    $tr.append( option_td );

    return $tr;
  },
  empty_services() {
    $("tbody").empty();
  }
}