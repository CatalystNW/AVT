/**
 * User can click on card headers to show or hide the data in card body
 * Saves and retrieves the hide info to localstorage.
 * 
 * Card headers should have the value=[app_status]
 * Card body should have id=[app_status]_cardbody
 */
var card_tabler = {
  add_click_handler(callback) {
    $(".card-header").on("click", function(e) {
      var app_status = $(this).attr("value");
      if (app_status) {
        var result = card_tabler.toggle_appstatus_show_status(app_status);
        card_tabler.toggle_card_header(app_status);

        if (callback){
          callback(app_status, result);
        }
      }
    });
  },
  // Get the name saved in local storage
  get_status_item_name(app_status) {
    return "CARE_show_" + app_status;
  }, 
  // Show/Hide the card header by app_status
  toggle_card_header(app_status) {
    var command = card_tabler.get_appstatus_show_status(app_status)
    var $cardbody = $("#" + app_status + "_cardbody"); // get table
    if (command == "hide")
      $cardbody.hide();
    else if (command == "show")
      $cardbody.show();
  },
  // Iterate through all headers & check if show/hide
  toggle_card_headers() {
    var app_status;
    $(".card-header").each(function(index, ele) {
      app_status = $( this ).attr("value");
      if (app_status)
        card_tabler.toggle_card_header(app_status);
    });
  },
  // get from local storage if card for that app_status is to show or hide
  get_appstatus_show_status(app_status) {
    var item_name = this.get_status_item_name(app_status);
    var result = window.localStorage.getItem(item_name);
    if (result === null || null === undefined)
      return "show";
    else
      return result;
  },
  // Save to local storage the show/hide status of the app_status card
  // & returns hide/show status
  toggle_appstatus_show_status(app_status) {
    var result = card_tabler.get_appstatus_show_status(app_status),
        item_name = this.get_status_item_name(app_status);
    
    var new_status = result == "show" ? "hide" : "show";
  
    window.localStorage.setItem(item_name, new_status);
    return new_status;
  }
};