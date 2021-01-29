// Note: app_id is a variable set by the page
var funkie = {
  // Convert the date given by server (UTC) to local date & time
  // Returns as a Date object
  convert_date(old_date) {
    var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      let [year, month, date, hours, minutes] = result.slice(1,6);
      return new Date(Date.UTC(year, parseInt(month)-1  , date, hours, minutes));
    }
    return null;
  },
  load_application(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../application/"+app_id,
      success: function(data, textStatus, xhr) {
        if (callback)
          callback(data);
      }
    });
  },
  calculate_page_height() {
    return window.innerHeight - document.getElementById("cPart").offsetHeight
    - document.getElementById("navbarResponsive").offsetHeight - 40
    - 36; // Manually put in footer height;
    // - document.getElementsByClassName("small")[0].offsetHeight;
  },
  get_assessment(assessment_id, callback) {
    if (callback) {
      $.ajax({
        type: "GET",
        url: "/app_project/site_assessment/" + assessment_id,
        success: function(data) {
          callback(data);
        }
      });
    }
  },
  get_assessment_by_appId(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../site_assessment/app_id/" + app_id,
      success: function(data, textStatus, xhr) {
        if (callback) {
          callback(data);
        }
      }
    });
  },
  create_workitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../workitems",
      type:"POST",
      data: form_data,
      success: function(result, textStatus, xhr) {
        if (menu_callback)
          menu_callback();
        data_callback_handler(result);
      }
    });
  },
  edit_workitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../workitems/" + form_data.workitem_id,
      type: "PATCH",
      data: form_data,
      success: function(result) {
        if (menu_callback)
          menu_callback();
        if (data_callback_handler)
          data_callback_handler(result);
      },
    })
  },
  delete_workitem(form_data, data_callback_handler) {
    $.ajax({
      url: "../workitems/" + form_data.workitem_id,
      type: "DELETE",
      success: function() {
        if (data_callback_handler) {
          data_callback_handler();
        }
      },
    });
  },
  create_materialsitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../materialsitem",
      type:"POST",
      data: form_data,
      success: function(result, textStatus, xhr) {
        if (menu_callback)
          menu_callback();
        data_callback_handler(result);
      }
    });
  },
  delete_materialsitem(materialsItem_id, callback) {
    $.ajax({
      url: "../materialsitem/" + materialsItem_id,
      type: "DELETE",
      success: function(result, textStatus, xhr) {
        if (callback) {
          callback(materialsItem_id);
        }
      }
    });
  },
  edit_materialsitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../materialsitem/" + form_data.materialsItem_id,
      type: "PATCH",
      data: form_data,
      success: function(result, textStatus, xhr) {
        if (menu_callback) 
          menu_callback();
        if (data_callback_handler) {
          data_callback_handler(result);
        }
      }
    });
  },
  edit_site_assessment(data, callback) {
    $.ajax({
      type: "PATCH",
      url: "../site_assessment/" + data.assessment_id,
      data: data,
      success: function(returnData, textStatus, xhr) {
        if (callback) {
          callback(returnData);
        }
      }
    });
  },
}
