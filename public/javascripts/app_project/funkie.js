var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Note: app_id is a variable set by the page
var funkie = {
  // Convert the date given by server (UTC) to local date & time
  // Returns as a Date object
  convert_date: function convert_date(old_date) {
    var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      var _result$slice = result.slice(1, 6),
          _result$slice2 = _slicedToArray(_result$slice, 5),
          year = _result$slice2[0],
          month = _result$slice2[1],
          date = _result$slice2[2],
          hours = _result$slice2[3],
          minutes = _result$slice2[4];

      return new Date(Date.UTC(year, parseInt(month) - 1, date, hours, minutes));
    }
    return null;
  },
  load_application: function load_application(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../application/" + app_id,
      success: function success(data, textStatus, xhr) {
        if (callback) callback(data);
      }
    });
  },
  calculate_page_height: function calculate_page_height() {
    return window.innerHeight - document.getElementById("cPart").offsetHeight - document.getElementById("navbarResponsive").offsetHeight - 40 - 36; // Manually put in footer height;
    // - document.getElementsByClassName("small")[0].offsetHeight;
  },
  get_assessment: function get_assessment(assessment_id, callback) {
    if (callback) {
      $.ajax({
        type: "GET",
        url: "/app_project/site_assessment/" + assessment_id,
        success: function success(data) {
          callback(data);
        }
      });
    }
  },
  get_assessment_by_appId: function get_assessment_by_appId(app_id, callback) {
    $.ajax({
      type: "GET",
      url: "../site_assessment/app_id/" + app_id,
      success: function success(data, textStatus, xhr) {
        if (callback) {
          callback(data);
        }
      }
    });
  },
  create_workitem: function create_workitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../workitems",
      type: "POST",
      data: form_data,
      success: function success(result, textStatus, xhr) {
        if (menu_callback) menu_callback();
        data_callback_handler(result);
      }
    });
  },
  edit_workitem: function edit_workitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../workitems/" + form_data.workitem_id,
      type: "PATCH",
      data: form_data,
      success: function success(result) {
        if (menu_callback) menu_callback();
        if (data_callback_handler) data_callback_handler(result);
      }
    });
  },
  delete_workitem: function delete_workitem(form_data, data_callback_handler) {
    $.ajax({
      url: "../workitems/" + form_data.workitem_id,
      type: "DELETE",
      success: function success() {
        if (data_callback_handler) {
          data_callback_handler();
        }
      }
    });
  },
  create_materialsitem: function create_materialsitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../materialsitem",
      type: "POST",
      data: form_data,
      success: function success(result, textStatus, xhr) {
        if (menu_callback) menu_callback();
        data_callback_handler(result);
      }
    });
  },
  delete_materialsitem: function delete_materialsitem(materialsItem_id, callback) {
    $.ajax({
      url: "../materialsitem/" + materialsItem_id,
      type: "DELETE",
      success: function success(result, textStatus, xhr) {
        if (callback) {
          callback(materialsItem_id);
        }
      }
    });
  },
  edit_materialsitem: function edit_materialsitem(form_data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "../materialsitem/" + form_data.materialsItem_id,
      type: "PATCH",
      data: form_data,
      success: function success(result, textStatus, xhr) {
        if (menu_callback) menu_callback();
        if (data_callback_handler) {
          data_callback_handler(result);
        }
      }
    });
  },
  edit_site_assessment: function edit_site_assessment(data, callback) {
    $.ajax({
      type: "PATCH",
      url: "../site_assessment/" + data.assessment_id,
      data: data,
      success: function success(returnData, textStatus, xhr) {
        if (callback) {
          callback(returnData);
        }
      }
    });
  },
  get_notes: function get_notes(project_id, callback) {
    $.ajax({
      url: "../projects/" + project_id + "/notes",
      type: "GET",
      success: function success(returnData) {
        if (callback) {
          callback(returnData);
        }
      }
    });
  },
  create_partner: function create_partner(data, menu_callback, data_callback_handler) {
    $.ajax({
      url: "/app_project/partners",
      type: "POST",
      data: data,
      success: function success(result) {
        if (menu_callback) menu_callback();
        if (data_callback_handler) {
          data_callback_handler(result);
        }
      }
    });
  }
};