var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

export { functionHelper };

var functionHelper = {
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
  getTableText: function getTableText(tableId) {
    var table = document.getElementById(tableId);
    var projectDataArray = [];
    for (var r = 0; r < table.rows.length; r++) {
      projectDataArray.push([]);
      for (var c = 0; c < table.rows[r].cells.length; c++) {
        projectDataArray[r].push(table.rows[r].cells[c].innerText.replace(/\n/ig, "; "));
      }
    }
    return projectDataArray;
  },
  exportCSV: function exportCSV(filename, dataArray) {
    var csvContent = "data:text/csv;charset=utf-8," + dataArray.map(function (row) {
      return row.join(",");
    }).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    var dateString = new Date().toISOString().replace(/T.*/, '');
    link.setAttribute("download", filename + dateString + ".csv");
    document.body.appendChild(link);
    link.click();
  },
  roundCurrency: function roundCurrency(n) {
    var mult = 100,
        value = void 0;
    value = parseFloat((n * mult).toFixed(6));
    return Math.round(value) / mult;
  },
  createTable: function createTable(id, projects, useProjectName) {
    return React.createElement(
      "table",
      { className: "table table-sm", id: id },
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "th",
            { scope: "col" },
            "Project Name"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Name"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Handle-It"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Start Date"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Location"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Work Items"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Home Type"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "CC"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "PA"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "SH"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Partners"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Volunteers"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Cost"
          ),
          React.createElement(
            "th",
            { scope: "col" },
            "Hours"
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        projects.map(function (project) {
          var cost = 0,
              volunteers = 0,
              hours = project.volunteer_hours;;
          project.workItems.forEach(function (workItem) {
            workItem.materialsItems.map(function (materialsItem) {
              cost += materialsItem.price * materialsItem.quantity;
            });
            volunteers += workItem.volunteers_required;
          });
          return React.createElement(
            "tr",
            { key: project._id },
            React.createElement(
              "td",
              null,
              !project.name || project.name.length == 0 ? React.createElement(
                "a",
                { href: "/app_project/view_projects/" + project._id, target: "_blank" },
                "N/A"
              ) : React.createElement(
                "a",
                { href: "/app_project/view_projects/" + project._id, target: "_blank" },
                project.name
              )
            ),
            React.createElement(
              "td",
              null,
              React.createElement(
                "a",
                { href: "/view/" + project.documentPackage._id, target: "_blank" },
                project.documentPackage.application.name.first + " " + project.documentPackage.application.name.last
              )
            ),
            React.createElement(
              "td",
              null,
              project.handleit ? "Y" : "N"
            ),
            React.createElement(
              "td",
              null,
              project.start ? functionHelper.convert_date(project.start).toLocaleDateString() : "None"
            ),
            React.createElement(
              "td",
              null,
              project.documentPackage.application.address.city
            ),
            React.createElement(
              "td",
              null,
              project.workItems.map(function (workItem, index) {
                return React.createElement(
                  "div",
                  { key: project._id + "_" + workItem._id },
                  index + ". " + workItem.name
                );
              })
            ),
            React.createElement(
              "td",
              null,
              project.documentPackage.property.home_type
            ),
            React.createElement(
              "td",
              null,
              project.crew_chief ? project.crew_chief : "N/A"
            ),
            React.createElement(
              "td",
              null,
              project.project_advocate ? project.project_advocate : "N/A"
            ),
            React.createElement(
              "td",
              null,
              project.site_host ? project.site_host : "N/A"
            ),
            React.createElement(
              "td",
              null,
              project.partners.map(function (partner) {
                return React.createElement(
                  "div",
                  { key: project._id + "_" + partner._id },
                  partner.org_name
                );
              })
            ),
            React.createElement(
              "td",
              null,
              volunteers
            ),
            React.createElement(
              "td",
              null,
              functionHelper.roundCurrency(cost).toFixed(2)
            ),
            React.createElement(
              "td",
              null,
              hours
            )
          );
        })
      )
    );
  },
  get_data: function get_data(formId) {
    var data = {};
    var formData = new FormData($("#" + formId)[0]);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = formData.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        data[key] = formData.get(key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return data;
  }
};