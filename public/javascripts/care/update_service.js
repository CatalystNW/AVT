window.onload = function() {
  var service_id = $("#service-id-input").val(),
      applicant_id = $("#applicant-id-input").val();
  
  //Get Service Data & fill into inputs
  $.ajax({
    type: "GET",
    url: "/carenetwork/services/" + service_id,
    success: function(data, textStatus, xhr) {
      if (xhr.status == 200) {
        // Date Input
        var regex = /(\d{4}-\d{2}-\d{2})/g
        var result = data["service_date"].match(regex);
        if (result) {
          $("#service-date-input").val(result[0]);
        }
        console.log($("#service-date-input").val());

        $("#note-input").val(data.note);

        // Select Worker for select
        var care_worker = data.care_worker;
        $(`option[value=${care_worker}]`).prop("selected", true);
      }
    }
  });
};