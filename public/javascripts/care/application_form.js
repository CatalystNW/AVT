// Check the form, in case html required doesn't work
var application_helper = {
  check_waiver() {
    return ($('input[name=waiver-radio]:checked').val() == "1");
  },
  check_inputs() {
    var filled_out = true;

    function check_element(index, element) {
      if ($(this).val().length <= 0) {
        $(this).css("border-color", "red");
        filled_out = false;
      }
    }
    
    $('input[notrequired]').each(check_element);
    $('textarea[notrequired]').each(check_element);
    $('radio[notrequired]').each(check_element);
    return filled_out;
  },
  check_marital() {
    return ($('input[name=marital_status]:checked').val() !== undefined);
  },
};

window.onload = function() {
  $("#applicant-form").on("submit", function(e) {
    // Check that some inputs are filled out and send data
    e.preventDefault();

    if (!application_helper.check_inputs()) {
      window.alert("Some of the required fields are missing. Please look at the red box");
      return;
    }
    if (!application_helper.check_marital()) {
      window.alert("Please select an option for the marital status");
      return;
    }
    if (!application_helper.check_waiver()) {
      window.alert("TO continue, please agree with the release");
      return;
    }

    var $form = $(this);

    $.ajax({
      type: "POST",
      url: $form.attr('action'),
      data: $form.serialize(),
      success: function(data, textStatus, xhr) {
        if (xhr.status == 201 && data && data.care_manager_status) {
          window.location.replace("./view_applications");
        } else {
          $form.trigger('reset'); // Reset form
          window.alert("Your form was submitted successfully. Someone will contact you within a few days.");
          window.location.replace("https://www.catalystnw.org/");
        }
      },
      error: function(xhr, ajaxOptions, err) {
        if (xhr.status == 500) {
          window.alert("A server error was encountered. Please contact someone in Catalyst");
        } else if (xhr.status == 404) {
          window.alert("One of the fields was missing. Please check again.");
        }
      }
    });
  });
};