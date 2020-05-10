window.onload = function() {
  app_obj.onload();

  this.card_tabler.add_click_handler((app_status, result) => {
    if (app_status == "completed" && result == "show" && 
      $("#completed_container").children().length == 0)
      app_obj.load_applications(); // Load app data to include completed apps
  });

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
          if (method == "POST") {
            service_obj.add_service_row(service.applicant, service);
            app_obj.add_service(service.applicant, service);
          } else {
            service_obj.update_service_row(service.applicant, service);
            app_obj.update_service(service.applicant, service);
          }
        }
      }
    });
  });
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
    var completed_show_cmd = card_tabler.get_appstatus_show_status("completed");
    var completed_show_status = (completed_show_cmd == "show") ? true : false;
  
    $.ajax({
      type: "GET",
      url: "/carenetwork/applications?show_completed=" + completed_show_status,
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
    this.empty_tables()
    card_tabler.toggle_card_headers();

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
    var service_add_btn = create_add_service_btn(applicant._id),
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
        id = this.get_id(service._id);

    var $service_tr = $("<tr></tr>", 
        {"class": tr_classname + " table-info",
          "id": id,});

    $service_tr.append($(`<td>${service.volunteer}</td>`));
    $service_tr.append($(`<td colspan="2">${service.description}</td>`));
    $service_tr.append($(`<td>${service.service_date}</td>`));
    $service_tr.append($(`<td>${service.status}</td>`));

    edit_button = $(`<button applicant_id=${app_id} service_id=${service._id} class='btn btn-sm btn-danger' type='button'>Edit</button>`);
    edit_button[0].setAttribute("data-toggle", "modal");
    edit_button[0].setAttribute("data-target", "#serviceModal");

    edit_button.on("click", function(e) {
      var service_id = $(this).attr("service_id"),
          app_id = $(this).attr("applicant_id");
      service_obj.load_edit_service_modal_form(app_id, service_id);
    });

    $service_tr.append($(`<td></td>`).append(edit_button));

    return $service_tr;
  },
  load_edit_service_modal_form(app_id, service_id) {
    $("#service-form")[0].reset();

    $("#service-form").attr("method", "PATCH");
    $("#service-form").attr("url", "./services/" + service_id);
    
    
    service_obj.load_servicedata_to_modalform(app_id, service_id);
    service_obj.load_app_info_to_form(app_id);
    $("#serviceForm-modalTitle").text("Edit Service");
  },
  load_add_service_modal_form(app_id) {
    $("#service-form")[0].reset();
    
    // Set modal title (because modal used for editing services too)
    $("#serviceForm-modalTitle").text("Add Service");
    $("#service-form").attr("method", "POST");

    $("#service-form").attr("url", "./services");
    $("#service-app-id-input").val(app_id); // fill hidden input with app_id
    service_obj.load_app_info_to_form(app_id);
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
  load_servicedata_to_modalform(app_id, service_id) {
    var service = app_obj.get_service(app_id, service_id);
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
    console.log(date_str);

    $("#service-date").val(date_str);
  },
  load_app_info_to_form(app_id) {
    $("#appInfo-serviceFormContainer").empty();
    var applicant = app_obj.get_applicant(app_id);
    var text = "Help Requested\n" + applicant.application.help_request + "\n\n";
    text += "Health Issues\n" + applicant.application.health_issues;
    $("#appInfo-serviceFormContainer").text(text);
  },
}

function create_add_service_btn(app_id) {
  var btn = document.createElement("button");
  btn.textContent = "Create Service";
  btn.setAttribute("value", app_id);
  btn.setAttribute("id", app_id + "-service-create-btn")
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target", "#serviceModal");
  btn.addEventListener("click", function(e) {
    var app_id = e.target.value;
    service_obj.load_add_service_modal_form(app_id);
  });
  btn.classList.add("btn", "btn-primary", "btn-sm");
  return btn;
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

