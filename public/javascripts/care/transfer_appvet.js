window.onload = function() {
  $(".transfer-btn").on("click", function (e) {
    var app_id = $(this).attr("value");
    $.ajax({
      type: "POST",
      url: "/carenetwork/transfer_appvet",
      data: {
        applicant_id: app_id
      },
      success: function(data, textStatus, xhr) {
        // reload even if error
        location.reload();
      }
    });
  });
};