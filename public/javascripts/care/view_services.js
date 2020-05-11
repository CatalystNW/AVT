window.onload = function() {
  this.service_obj.get_services();

  this.card_tabler.start("view_services", (app_status, result) => {
    ;
  });
};

var service_obj = {
  get_services() {
    $.ajax({
      type: "GET",
      url: "./services",
      success: function(servicesData, textStatus, xhr) {
        if (xhr.status == 201 || xhr.status == 200) {
          services_table.add_service_rows(servicesData);
        }
      }
    });
  },
};

var services_table = {
  get_tbody_id(app_status) {
    return app_status + "_container";
  },
  add_service_rows(servicesData) {
    this.empty_services();

    console.log(servicesData);

    for(var  i=0; i<servicesData.length; i++) {
      this.add_service_row(servicesData[i]);
    }
  },
  add_service_row(serviceData) {
    var tbody_id = this.get_tbody_id(serviceData.status);
    var $tr = $("<tr></tr>");
    $tr.append( $(`<td>${serviceData.service_date}</td>`) );
  
    $tr.append( $(`<td>${serviceData.status}</td>`));
    $tr.append( $(`<td>${serviceData.volunteer}</td>`));
    $tr.append( $(`<td>${serviceData.applicant.reference}</td>`));
    $tr.append( $(`<td>${serviceData.createdAt}</td>`));
    $tr.append( $(`<td></td>`));
    
    $("#" + tbody_id).append($tr);
  },
  empty_services() {
    $("tbody").empty();
  }
}