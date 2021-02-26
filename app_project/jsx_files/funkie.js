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
      url: "/app_project/application/"+app_id,
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
        url: "/app_project/site_assessments/" + assessment_id,
        success: function(data) {
          callback(data);
        }
      });
    }
  },
  create_workitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "/app_project/workitems",
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
      url: "/app_project/workitems/" + form_data.workitem_id,
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
      url: "/app_project/workitems/" + form_data.workitem_id,
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
      url: "/app_project/materialsitem",
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
      url: "/app_project/materialsitem/" + materialsItem_id,
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
      url: "/app_project/materialsitem/" + form_data.materialsItem_id,
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
      url: "/app_project/site_assessments/" + data.assessment_id,
      data: data,
      success: function(returnData, textStatus, xhr) {
        if (callback) {
          callback(returnData);
        }
      }
    });
  },
  get_notes(project_id, callback) {
    $.ajax({
      url: "/app_project/projects/" + project_id + "/notes",
      type: "GET",
      success: function(returnData) {
        if (callback) {
          callback(returnData);
        }
      },
    });
  },
  create_partner(data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "/app_project/partners",
      type: "POST",
      data: data,
      success: function(result) {
        if (menu_callback) 
          menu_callback();
        if (data_callback_handler) {
          data_callback_handler(result);
        }
      }
    });
  },
  edit_partner(data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "/app_project/partners/" + data.partner_id,
      type: "PATCH",
      data: data,
      success: function(result) {
        if (menu_callback) 
          menu_callback();
        if (data_callback_handler) {
          data_callback_handler(result);
        }
      }
    });
  },
}
