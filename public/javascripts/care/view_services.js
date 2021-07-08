window.addEventListener("load", function() {
  this.card_tabler.start("view_services", 
    function click_callback(app_status, result) {
      if (app_status == "complete" && result == "show" && 
        $("#complete_container").children().length == 0)
        service_obj.load_services(); // Load app data to include complete apps
    }
  );
  this.service_obj.load_services();

  applicant_form_modal.setup_form();

  service_form_modal.setup_form(
    (method, service) => {
      if (method == "POST") {
        ;
      } else { // Edited Form
        services_table.update_service_row(service);
      }
    }
  );
  
  $(".services-header-tr").on("click", 
    services_table.sort_services_handler);
};

var service_obj = {
  data: null,
  update_service(service) {
    for (var i=0; i< this.data.length; i++) {
      if (service._id == this.data[i]._id) {
        for(var prop in service) {
          if (prop != "applicant" && prop in this.data[i]) {
            this.data[i][prop] = service[prop];
          }
        }
        break;
      }
    }
  },
  get_data() {
    return this.data;
  },
  load_services() {
    var complete_show_cmd = card_tabler.get_appstatus_show_status("complete");
    var complete_show_status = (complete_show_cmd == "show") ? true : false;

    $.ajax({
      type: "GET",
      url: "/carenetwork/services?show_complete=" + complete_show_status,
      success: function(servicesData, textStatus, xhr) {
        if (xhr.status == 201 || xhr.status == 200) {
          service_obj.data = servicesData;
          services_table.load_service_rows();
        }
      }
    });
  },
  sort_data(sort_type) {
    if (sort_type === "service_date") {
      service_obj.data.sort((a, b) => {
        return new Date(a.service_date) - new Date(b.service_date);
      });
    } else if (sort_type === "status" || sort_type === "volunteer"
        || sort_type === "reference") {
          
      service_obj.data.sort((a, b) => {
        var strA, strB;
        if (sort_type === "status")  {
          strA = a.status;
          strB = b.status;
        } else if (sort_type === "volunteer") {
          strA = a.volunteer;
          strB = b.volunteer;
        } else {
          strA = a.applicant.reference;
          strB = b.applicant.reference;
        }
        strA = strA.toUpperCase();
        strB = strB.toUpperCase();
        console.log(strA, strB);
        if (strA < strB) {
          return -1;
        } else if (strA > strB) {
          return 1;
        }
        return 0;
      });
    } else if (sort_type == "create_date") {
      service_obj.data.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else {
      return false;
    }
    return true;
  },
};

var services_table = {
  sort_services_handler(event) {
    var sort_type = event.target.getAttribute("name");
    
    if (service_obj.sort_data(sort_type)) {
      console.log(service_obj.get_data())
      console.log("sort", sort_type)
      services_table.load_service_rows();
    }
  },
  get_id(service_id) {
    return service_id + "-service-tr";
  },
  update_service_row(service) {
    service_obj.update_service(service);
    services_table.load_service_rows();
  },
  get_tbody_id(app_status) {
    return app_status + "_container";
  },
  load_service_rows() {
    this.empty_services();
    var servicesData = service_obj.get_data();

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

    $tr.append( $(`<td class="col-lg-2">${serviceData.service_date}</td>`) );
    $tr.append( $(`<td class="col-lg-2">${serviceData.status}</td>`));
    $tr.append( $(`<td class="col-lg-2">${serviceData.volunteer}</td>`));
      
    var $td = $(`<td class="col-lg-2"></td>`);
    var link = applicant_form_modal.create_link(
      serviceData.applicant._id, applicant_reference);
    
    $td.append(link);
    $tr.append($td);

    $tr.append( $(`<td class="col-lg-2">${serviceData.createdAt}</td>`));
    var option_td = $(`<td class="col-lg-2"></td>`);
    
    option_td.append(
      $(`<a class="btn btn-sm btn-primary" 
        href='view_service/${service_id}'>View</a>`));

    option_td.append(edit_btn);
    $tr.append( option_td );

    return $tr;
  },
  empty_services() {
    $("tbody").empty();
  }
}