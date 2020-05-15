window.onload = function() {
  this.card_tabler.start("applications", 
    function click_callback(app_status, result) {
      if (app_status == "complete" && result == "show" && 
        $("#complete_container").children().length == 0)
        app_obj.load_applications(); // Load app data to include complete apps
  });

  app_obj.onload();

  service_form_modal.setup_form(
    (method, service) => {
      if (method == "POST") {
        service_obj.add_service_row(service.applicant, service);
        app_obj.add_service(service.applicant, service);
      } else {
        service_obj.update_service_row(service.applicant, service);
        app_obj.update_service(service.applicant, service);
      }
    }
  );
};

var app_obj = {
  applicants: null,
  add_service(app_id, service) {
    var applicant = this.get_applicant(app_id);
    applicant.services.push(service);
  },
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
  },

  load_applications() {
    var complete_show_cmd = card_tabler.get_appstatus_show_status("complete");
    var complete_show_status = (complete_show_cmd == "show") ? true : false;
  
    $.ajax({
      type: "GET",
      url: "/carenetwork/applications?show_complete=" + complete_show_status,
      success: function(applicants, textStatus, xhr) {
        if (xhr.status == 200) {
          app_obj.applicants = applicants;
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
        if (applicants[i].createdAt.includes(year))
        this.add_application(applicants[i]);
      } else {
        this.add_application(applicants[i]);
      }
    }
  },
  add_application(applicant) {
    var $container, $tr, name;
    $container = $("#" + applicant.application_status+ "_container");
    $tr = $("<tr></tr>", {id: applicant._id + "_tr"});
  
    name = applicant.application.first_name;
    if (applicant.application.middle_name)
      name += " " + applicant.application.middle_name
    name += " " + applicant.application.last_name
    $tr.append(
      $(`<td><a href=${applicant.self}>${name}</a></td>`));
  
    $tr.append($(`<td>${applicant.createdAt}</td>`));
    $tr.append($(`<td>${applicant.updatedAt}</td>`));
    $tr.append($(`<td>${applicant.reference}</td>`));
    $tr.append($(`<td>${applicant.services.length}</td>`));
    var service_add_btn = service_form_modal.create_add_button(applicant._id),
        service_show_btn = create_service_hide_btn(applicant._id);
    $tr.append($(`<td></td>`)
      .append(service_add_btn)
      .append(service_show_btn)
      );
    $(service_add_btn).hide();
    
    $container.append($tr);
  
    service_obj.add_service_rows(applicant._id, applicant.services, $container);
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

var service_obj ={
  get_tr_class(applicant_id) {
    return applicant_id + "-service-tr";
  },
  get_id(service_id) {
    return service_id + "-service-tr";
  },
  add_service_rows(app_id, services, container_element) {
    var $service_tr,
        tr_classname = this.get_tr_class(app_id);

    // Header for Service
    $service_tr = $("<tr></tr>", 
      {"class": tr_classname + " table-info"});

    $service_tr.append($(`<th>Volunteer</th>`));
    $service_tr.append($(`<th colspan="2">Description</th>`));
    $service_tr.append($(`<th>Service Date</th>`));
    $service_tr.append($(`<th>Status</th>`));
    $service_tr.append($(`<th>Options</th>`));

    container_element.append($service_tr);
    $service_tr.hide();

    for (var i=0; i<services.length; i++) {
      $service_tr = this.make_service_row(app_id, services[i]);

      container_element.append($service_tr);
      $service_tr.hide();
    }
  },
  make_service_row(app_id, service) {
    var tr_classname = this.get_tr_class(app_id),
        tr_id = this.get_id(service._id);

    var $service_tr = $("<tr></tr>", 
        {"class": tr_classname + " table-info",
          "id": tr_id,});

    $service_tr.append($(`<td>${service.volunteer}</td>`));
    $service_tr.append($(`<td colspan="2">${service.description}</td>`));
    $service_tr.append($(`<td>${service.service_date}</td>`));
    $service_tr.append($(`<td>${service.status}</td>`));

    var edit_button = service_form_modal.create_edit_button(app_id, service._id);

    $service_tr.append($(`<td></td>`).append(edit_button));

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
    
    $trs = $("." + tr_classname);
    var $last_tr = $trs[$trs.length - 1];
    new_tr.insertAfter($last_tr);
  },
}

function create_service_hide_btn(app_id) {
  var btn = document.createElement("button");
  btn.textContent = "Show Service";
  btn.setAttribute("value", app_id);
  btn.addEventListener("click", function(ele) {
    var btn = ele.target,
        app_id = btn.getAttribute("value");

    if (btn.textContent.toUpperCase().includes("HIDE")) {
      $("." +service_obj.get_tr_class(app_id)).hide();
      btn.textContent = "Show Service";
      $("#" + app_id + "-service-create-btn").hide();
    } else {
      $("." +service_obj.get_tr_class(app_id)).show();
      btn.textContent = "Hide Service";
      $("#" + app_id + "-service-create-btn").show();
    }
  });

  btn.classList.add("btn", "btn-primary", "btn-sm");
  return btn;
}

