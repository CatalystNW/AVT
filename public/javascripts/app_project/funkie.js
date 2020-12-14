// Note: app_id is a variable set by the page
var funkie = {
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
    - document.getElementsByClassName("small")[0].offsetHeight;
  },
  get_assessment(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../site_assessment/" + app_id,
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
    })
  },
  set_handleit(workitem_id, data_callback) {
    $.ajax({
      url: "../workitems",
      type: "PATCH",
      data: {
        property: "handleit",
        workitem_id: workitem_id,
      },
      success: function(result, textStatus, xhr) {
        if (data_callback)
          data_callback(result);
      }
    })
  },
  delete_item(materialsItem_id, callback) {
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
  create_costsitem(data, menu_callback, data_callback_handler) {
    $.ajax({
      type: "POST",
      url: "../site_assessment/" + data.assessment_id +"/costsitems",
      data: data,
      success: function(result, textStatus, xhr) {
        if (menu_callback) 
          menu_callback();
        if (data_callback_handler) {
          data_callback_handler(result);
        }
      },
    });
  },
  del_costsitem(data, callback) {
    $.ajax({
      type: "DELETE",
      url: "../costsitems/" + data.costsitem_id,
      success: function(result, textStats, xhr) {
        if (callback) {
          callback();
        }
      }
    });
  },
  edit_costsitem(data, menu_callback, data_callback_handler) {
    $.ajax({
      type: "PATCH",
      url: "../costsitems/" + data.costsitem_id,
      data: data,
      success: function(result, textStats, xhr) {
        if (menu_callback)
          menu_callback();
        if (data_callback_handler) {
          data_callback_handler(result);
        }
      }
    });
  },
  edit_workitem() {
    console.log("edit workitem");
  }
}
