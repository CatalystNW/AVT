window.onload = function() {
  this.card_tabler.start("applications", 
    function click_callback(app_status, result) {
      if (app_status == "do_not_contact" && result == "show" && 
        $("#do_not_contact_container").children().length == 0)
        app_obj.load_applications(); // Load app data to include do_not_contact apps
  });

  app_obj.onload();

  applicant_form_modal.setup_form();

  service_form_modal.setup_form(
    (method, service) => {
      if (method == "POST") {
        app_obj.add_service(service.applicant, service);
        service_obj.show_services(service.applicant);
        service_obj.add_service_row(service.applicant, service);
      } else {
        service_obj.update_service_row(service.applicant, service);
        app_obj.update_service(service.applicant, service);
      }
    }
  );
};
// handles the application element component
var app_obj = {
  applicants: null,
  get_tr_id(service_id) {
    return service_id + "-app-tr";
  },
  add_service(app_id, service) {
    var applicant = this.get_applicant(app_id);
    applicant.services.push(service);

    var service_td = $("#" + applicant._id + "_services_count");
    service_td.text(applicant.services.length);
  },
  // Updates the service object in applicants
  update_service(app_id, service) {
    var applicant = this.get_applicant(app_id);
    
    var s = applicant.services
    for (var i=0; i <s.length; i++) {
      if (s[i]._id == service._id) {
        s[i] = service;
      }
    }
  },
  onload() {
    this.load_applications();
    this.add_change_year_select_handler();
    $(".applications_header_tr").on("click", 
        this.sort_applications_handler);
  },

  sort_applications_handler(event) {
    var sort_name = event.target.getAttribute("name");
    if (sort_name === "name" || sort_name === "reference") {
      app_obj.applicants.sort((a, b) => {
        var strA, strB;
        if (sort_name === "name")  {
          strA = a.application.first_name;
          strB = b.application.first_name;
        } else {
          strA = a.reference;
          strB = b.reference;
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
    } else if (sort_name === "application_date") {
      app_obj.applicants.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else if (sort_name === "last_edit_date") {
      app_obj.applicants.sort((a, b) => {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      });
    } else if (sort_name === "num_services") {
      app_obj.applicants.sort((a, b) => {
        return a.services.length - b.services.length;
      });
    } else {
      return;
    }
    app_obj.load_apps_to_table();
  },

  load_applications() {
    var do_not_contact_show_cmd = card_tabler.get_appstatus_show_status("do_not_contact");
    var do_not_contact_show_status = (do_not_contact_show_cmd == "show") ? true : false;
  
    $.ajax({
      type: "GET",
      url: "/carenetwork/applications?show_do_not_contact=" + do_not_contact_show_status,
      success: function(applicants, textStatus, xhr) {
        if (xhr.status == 200) {
          for (var i=0;i<applicants.length;i++) {
            applicants[i].services.sort(function(a, b) {
              return new Date(b.service_date) - new Date(a.service_date);
            });
          }
          app_obj.applicants = applicants;
          console.log(applicants)
          app_obj.load_apps_to_table();
          app_obj.load_year_to_select();
        }
      }
    });
  },
  load_year_to_select() {
    var applicants = this.applicants;
    var $sel = $("#yearSelect");
    $sel.empty();
    $sel.append($("<option value='all'>All</select>"));

    var year;
    var re = /\d+\/\d+\/(\d+)/;

    var yearsObj = {},
        yearsArr = [];
    for(var i=0; i<applicants.length; i++) {
      year = re.exec(applicants[i].createdAt)[1];
      yearsObj[year] = true;
    }

    for (year in yearsObj) {
      yearsArr.push(year);
    }
    yearsArr.sort();
    for (var i =yearsArr.length - 1; i>= 0; i--) {
      $sel.append($(`<option >${yearsArr[i]}</select>`));
    }
  },
  add_change_year_select_handler() {
    $("#yearSelect").on("change", function() {
      var year = $(this).val();
      if (year == "all")
        app_obj.load_apps_to_table();
      else
      app_obj.load_apps_to_table(year);
    });
  },
  empty_tables() {
    $("tbody[class='apps_container']").empty();
  },
  load_apps_to_table(year) {
    this.empty_tables();

    var applicants = this.applicants;
    for (var i=0; i<applicants.length; i++) {
      if (year != undefined) {
        // If User selects a year to show, only show those applications
        if (applicants[i].createdAt.includes(year))
          this.add_application(applicants[i]);
      } else {
        this.add_application(applicants[i]);
      }
    }
  },
  add_application(applicant) {
    var $container, $tr;

    $container = $("#" + applicant.application_status+ "_container");
    $tr = this.make_app_row(applicant);
    
    $container.append($tr);
  
    service_obj.add_service_rows(applicant._id, applicant.services, $tr);
  },
  update_applicant(app_id, new_applicant_data) {
    var applicants = this.applicants;
    for (var i=0; i < applicants.length; i++) {
      if (applicants[i]._id == app_id)
        applicants[i] = new_applicant_data;
    }
  },
  update_app_table(new_applicant_obj) {
    var app_id = new_applicant_obj._id;
    var tr_id = app_obj.get_tr_id(app_id),
        $old_tr = $("#" + tr_id);

    var $new_tr = app_obj.make_app_row(new_applicant_obj),
        old_applicant = app_obj.get_applicant(app_id);
    
    // Move the application row to new status if it has changed
    if (old_applicant.application_status != new_applicant_obj.application_status) {
      $old_tr.remove();
      var $container = $("#" + new_applicant_obj.application_status+ "_container");
      $container.append($new_tr);
    } else {
      $old_tr.replaceWith($new_tr);
    }

    app_obj.update_applicant(app_id, new_applicant_obj);
    service_obj.remove_services(app_id);
    service_obj.add_service_rows(app_id, new_applicant_obj.services, $new_tr);
  },
  make_app_row(applicant) {
    var $tr = $("<tr></tr>", {id: this.get_tr_id( applicant._id ) });

    name = applicant.application.first_name;
    if (applicant.application.middle_name)
      name += " " + applicant.application.middle_name;
    name += " " + applicant.application.last_name;
    var name_td = $(`<td class="col-lg-2"></td>`);

    // Link in the application name that will open the application form/modal
    var link = applicant_form_modal.create_link(
                applicant._id, name, this.update_app_table);

    name_td.append(link);
    $tr.append(name_td);
  
    $tr.append($(`<td class="col-lg-2">${applicant.createdAt}</td>`));
    $tr.append($(`<td class="col-lg-2">${applicant.updatedAt}</td>`));
    $tr.append($(`<td class="col-lg-2">${applicant.reference}</td>`));
    $tr.append($(`<td class="col-lg-2" id=${applicant._id}_services_count>
                  ${applicant.services.length}</td>`));
                  
    var service_add_btn = service_form_modal.create_add_button(applicant._id),
        service_show_btn = create_service_btn(applicant._id);
    $tr.append($(`<td class="col-lg-2"></td>`)
      .append(service_show_btn)
      .append(service_add_btn)
      );
    // $(service_add_btn).hide();
    return $tr;
  },
  get_applicant(app_id) {
    var applicants = this.applicants;
    for (var i=0; i < applicants.length; i++) {
      if (applicants[i]._id == app_id)
        return applicants[i];
    }
  },
  get_service(app_id, service_id) {
    var applicant = this.get_applicant(app_id);
    for (var i=0; i< applicant.services.length; i++) {
      if (service_id == applicant.services[i]._id)
        return applicant.services[i];  
    }
  }
}
// handles the service element components
var service_obj ={
  get_tr_class(applicant_id) {
    return applicant_id + "-service-tr";
  },
  remove_services(applicant_id) {
    $("." + this.get_tr_class(applicant_id)).remove();
  },
  get_id(service_id) {
    return service_id + "-service-tr";
  },
  add_service_rows(app_id, services, applicant_row) {
    var $service_tr,
        tr_classname = this.get_tr_class(app_id);

    // Header for Service
    $service_tr = $("<tr></tr>", 
      {"class": tr_classname + " table-info"});

    $service_tr.append($(`<th class="col-lg-2">Volunteer</th>`));
    $service_tr.append($(`<th colspan="2" class="col-lg-4">Description</th>`));
    $service_tr.append($(`<th class="col-lg-2">Service Date</th>`));
    $service_tr.append($(`<th class="col-lg-2">Status</th>`));
    $service_tr.append($(`<th class="col-lg-2">Options</th>`));

    $service_tr.insertAfter(applicant_row);
    $service_tr.hide();

    var $prev_tr = $service_tr;

    for (var i=0; i<services.length; i++) {
      $service_tr = this.make_service_row(app_id, services[i]);

      $service_tr.insertAfter($prev_tr);
      $service_tr.hide();
      $prev_tr = $service_tr;
    }
  },
  make_service_row(app_id, service) {
    var tr_classname = this.get_tr_class(app_id),
        tr_id = this.get_id(service._id);

    var $service_tr = $("<tr></tr>", 
        {"class": tr_classname + " table-info",
          "id": tr_id,});

    $service_tr.append($(`<td class="col-lg-2">${service.volunteer}</td>`));
    $service_tr.append($(`<td colspan="2" class="col-lg-4">${service.description}</td>`));
    $service_tr.append($(`<td class="col-lg-2">${service.service_date}</td>`));
    $service_tr.append($(`<td class="col-lg-2">${service.status}</td>`));

    var edit_button = service_form_modal.create_edit_button(app_id, service._id);

    $service_tr.append($(`<td class="col-lg-2"></td>`).append(edit_button));

    return $service_tr;
  },
  update_service_row(app_id, service) {
    var id = this.get_id(service._id);
    var new_tr = this.make_service_row(app_id, service);
    $("#" + id).replaceWith(new_tr);
  },
  add_service_row(app_id, service) {
    var tr_classname = this.get_tr_class(app_id),
        new_tr = this.make_service_row(app_id, service);
    
    var $trs = $("." + tr_classname);
    var $last_tr = $trs[$trs.length - 1];
    new_tr.insertAfter($last_tr);
  },
  hide_services(app_id){
    var btn = $(`button[id=${app_id}-service-hide-btn]`);
    $("." +service_obj.get_tr_class(app_id)).hide(); // hide services
    btn.text("Show Service");
  },
  show_services(app_id) {
    var btn = $(`button[id=${app_id}-service-hide-btn]`);
    $("." +service_obj.get_tr_class(app_id)).show(); // show services
    btn.text("Hide Service");
  }
}
// btn to show services
function create_service_btn(app_id) {
  var btn = document.createElement("button");
  btn.textContent = "Show Service";
  btn.setAttribute("value", app_id);
  btn.setAttribute("id", app_id + "-service-hide-btn");
  btn.addEventListener("click", function(ele) {
    var btn = ele.target,
        app_id = btn.getAttribute("value");

    if (btn.textContent.toUpperCase().includes("HIDE")) {
      service_obj.hide_services(app_id);
    } else {
      service_obj.show_services(app_id);
    }
  });

  btn.classList.add("btn", "btn-success", "btn-sm");
  return btn;
}

