var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { VettingWorkItemApp };
import { WorkItem } from "../../workitem.js";
import { ModalMenu } from "../../modalmenu.js";

// props. appId: documentPackage/ application id

var VettingWorkItemApp = function (_React$Component) {
  _inherits(VettingWorkItemApp, _React$Component);

  function VettingWorkItemApp(props) {
    _classCallCheck(this, VettingWorkItemApp);

    var _this = _possibleConstructorReturn(this, (VettingWorkItemApp.__proto__ || Object.getPrototypeOf(VettingWorkItemApp)).call(this, props));

    _this.loadAssessment = function () {
      $.ajax({
        url: "/app_project//site_assessments/application/" + _this.props.appId,
        context: _this,
        type: "GET",
        success: function success(assessment) {
          console.log(assessment);
          this.assessmentId = assessment._id;
          this.setState({
            workItems: assessment.workItems
          });
        }
      });
    };

    _this.onSubmit_createWorkItem = function (e) {
      e.preventDefault();
      if (_this.assessmentId) {
        var data = _this.getData();
        data.type = "assessment";
        data.assessment_id = _this.assessmentId;
        $.ajax({
          url: "/app_project/workitems",
          type: "POST",
          data: data,
          success: function success(workitem) {
            console.log(workitem);
          }
        });
      }
    };

    _this.clearForm = function () {
      var form = document.getElementById(_this.formId);
      form.reset();
    };

    _this.getData = function () {
      var data = {};
      var formData = new FormData($("#" + _this.formId)[0]);
      formData.set("handleit", formData.get("handleit") == "on" ? true : false);

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
    };

    _this.remove_workitem = function (workitem_id) {
      _this.setState(function (state) {
        var new_workitems = [].concat(_toConsumableArray(state.workItems));
        for (var i = 0; i < new_workitems.length; i++) {
          if (new_workitems._id == workitem_id) {
            new_workitems.splice(i, 1);
            break;
          }
        }
        return { workItems: new_workitems };
      });
    };

    _this.set_create_materialsitem_menu = function (e, materialsitem_handler) {
      var data = {
        workitem_id: e.target.getAttribute("workitem_id")
      };
      _this.modalmenu.current.show_menu("create_materialsitem", funkie.create_materialsitem, data, materialsitem_handler);
    };

    _this.set_edit_workitem_menu = function (data, edit_workitem_handler) {
      _this.modalmenu.current.show_menu("edit_workitem", funkie.edit_workitem, data, edit_workitem_handler);
    };

    _this.set_edit_materialisitem_menu = function (old_data, edit_materialsitem_handler) {
      _this.modalmenu.current.show_menu("edit_materialsitem", funkie.edit_materialsitem, old_data, edit_materialsitem_handler // <WorkItem> method
      );
    };

    _this.state = {
      workItems: []
    };
    _this.assessmentId = null;
    _this.loadAssessment();
    _this.formId = "workitem-create-form";
    _this.modalmenu = React.createRef();
    return _this;
  }

  _createClass(VettingWorkItemApp, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "col-xs-12 col-sm-6 col-md-3" },
          React.createElement(
            "h3",
            null,
            "Add a Work Item"
          ),
          React.createElement(
            "div",
            { className: "panel panel-primary work-item", name: "new" },
            React.createElement(
              "div",
              { className: "panel-body" },
              React.createElement(
                "h4",
                { className: "card-title" },
                "New Work Item"
              ),
              React.createElement(
                "form",
                { onSubmit: this.onSubmit_createWorkItem, id: this.formId },
                React.createElement(
                  "div",
                  { className: "card-text" },
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Name*"
                    ),
                    React.createElement("input", { type: "text", className: "form-control", name: "name", required: true })
                  ),
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Description*"
                    ),
                    React.createElement("textarea", { className: "form-control", name: "description", rows: "3" })
                  ),
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Vetting Comments*"
                    ),
                    React.createElement("textarea", { className: "form-control", name: "vettingComments", rows: "3", required: true })
                  ),
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Handle-it"
                    ),
                    React.createElement("input", { type: "checkbox", name: "handleit", id: "checkbox1", style: { "marginLeft": "10px; !important" } })
                  )
                ),
                React.createElement(
                  "button",
                  { type: "submit", className: "btn btn-primary card-link" },
                  "Save"
                ),
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-danger card-link",
                    onClick: this.clearForm },
                  "Clear"
                )
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-xs-12 col-sm-6 col-md-9" },
          React.createElement(
            "h3",
            null,
            "Current Work Items"
          ),
          this.state.workItems.map(function (workItem) {
            return React.createElement(WorkItem, { key: workItem._id,
              workitem: workItem,
              remove_workitem: _this2.remove_workitem,
              set_edit_materialisitem_menu: _this2.set_edit_materialisitem_menu,
              set_create_materialsitem_menu: _this2.set_create_materialsitem_menu,
              set_edit_workitem_menu: _this2.set_edit_workitem_menu
            });
          })
        ),
        React.createElement(ModalMenu, { ref: this.modalmenu })
      );
    }
  }]);

  return VettingWorkItemApp;
}(React.Component);

/**
 * Commented out JS code from b3-worksheet-view.hbs used in old worksheet functions
 * Left here to slowly migrate to this file using JS and React

$('.work-item-edit').each(watchEditButton)
$('.work-item-delete').on('click', showWorkItemDeleteConfirm)
$('.work-item-new').on('click', handleNewWorkItemSubmission)
$('.work-item-clear').on('click', handleNewWorkItemClear)


function watchEditButton(idx) {
  $(this).on('click', showWorkItemEditForm)
}

function showWorkItemEditForm(e) {
  e.preventDefault()
  var workItemParent = this.parentElement
  var workItemContainer = $(workItemParent)
  var workItemId = $(workItemParent.parentElement).attr('name')

  var currentData = {}
  $('[name*="' + workItemId + '"]', workItemContainer).each(function(idx) {
    var path = $(this).attr('name').replace(workItemId + '.', '')
    currentData[path] = this.innerText
  })

  workItemContainer.empty()

  var fields = [
    {field: 'name', text:'Name'},
    {field: 'description', text: 'Description', type: 'textarea'},
    {field: 'vettingComments', text: 'Vetting Comments', type: 'textarea'},
    {field: 'cost', text: 'Cost'},
  ]

  fields.forEach(function(f) {
    var formGroup = $('<div class="form-group"></div>')
    $('<label>' + f.text + '</label>').appendTo(formGroup)
    if (f.type && f.type === 'textarea') {
      $('<textarea></textarea>')
      .addClass('form-control')
      .attr('name', workItemId + '.' + f.field)
      .attr('rows', 5)
      .val(currentData[f.field])
      .appendTo(formGroup)
    } else {
      $('<input></input>')
      .addClass('form-control')
      .attr('name', workItemId + '.' + f.field)
      .val(currentData[f.field])
      .appendTo(formGroup)
    }

    workItemContainer.append(formGroup)
  })

  $('<button></button>')
  .text('Save')
  .addClass('btn').addClass('btn-primary')
  .addClass('card-link')
  .on('click', function(e) {
    saveWorkItem(workItemContainer)
  })
  .appendTo(workItemContainer)

  $('<button></button>')
  .text('Cancel')
  .addClass('btn').addClass('btn-danger')
  .addClass('card-link')
  .on('click', function(e) {
    for (let i=0; i<workItems.length; i++) {
      if (workItems[i]._id === workItemId) {
        showWorkItem(workItems[i], workItemContainer)
      }
    }
  })
  .appendTo(workItemContainer)
}

function showWorkItem(data, node) {
  node.empty()

  var cardBlock = node

  $('<h4></h4>').addClass('card-title')
  .attr('name', data._id + '.name')
  .text(data.name)
  .appendTo(cardBlock)

  $('<p></p>').addClass('text-muted')
  .text(new Date(data.date).toString())
  .appendTo(cardBlock)

  var cardText = $('<p></p>').addClass('card-text')
  .appendTo(cardBlock)

  $('<strong>Description:</strong>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<span></span>')
  .attr('name', data._id + '.description')
  .text(data.description)
  .appendTo(cardText)

  $('<br></br>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<strong>Vetting Comments:</strong>').appendTo(cardText)
  // $('<br></br>').appendTo(cardText)

  $('<p></p>').text(data.vettingComments)
  .attr('name', data._id + '.vettingComments')
  .appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<strong>Site Comments:</strong>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<p></p>')
  .text(data.siteComments).appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  
  $('<strong>Project Comments:</strong>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<p></p>')
  .text(data.projectComments).appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<strong>Cost:</strong>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<span></span>')
  .attr('name', data._id + '.cost')
  .text(data.cost)
  .appendTo(cardText)

  $('<a></a>').addClass('btn').addClass('btn-primary')
  .addClass('card-link').addClass('work-item-edit')
  .text('Edit')
  .attr('href', '#')
  .on('click', showWorkItemEditForm)
  .appendTo(cardBlock)

  $('<a></a>').addClass('btn').addClass('btn-danger')
  .addClass('card-link').addClass('work-item-delete')
  .text('Delete')
  .attr('href', '#')
  .on('click', showWorkItemDeleteConfirm)
  .appendTo(cardBlock)
}

function saveWorkItem(node) {
  var data = {}, id = false
  $('input, textarea', node).each(function(idx) {
    var path = this.name.split('.')[1]
    data[path] = this.value
    if (!id) id = this.name.split('.')[0]
  })

  // XHR here
  var xhrData = JSON.parse(JSON.stringify(data))
  xhrData.id = id

  xhr(xhrData, 'POST', '/vettingworksheet/updateitem', function(err) {
    if (err) {
      // TODO: If error, flip the value back and show an error message to the user
      // alert('Value did not save, please reload the page')
    }

    for (var i=0; i<workItems.length; i++) {
      if (workItems[i]._id === id) {
        Object.keys(data).forEach(function(k) {
          workItems[i][k] = data[k]
        })

        showWorkItem(workItems[i], node)
      }
    }
  })






}

function handleNewWorkItemSubmission(e) {
  if (e) e.preventDefault()
    var newWorkItem = {}, error = false

  $('input, textarea', e.target.parentNode).each(function(idx) {
    if (this.value.length === 0 && this.name !== 'cost' && this.name !=='isHandle') {
      $(this.parentNode).addClass('has-error')
      error = true
    } else {
      newWorkItem[this.name] = this.value

      if ($('#checkbox1').is(':checked')) {
      newWorkItem["isHandle"] = true
      } else {
      newWorkItem["isHandle"] = false
      }
      //var aChk =  $('#checkbox1').val()


      $(this.parentNode).removeClass('has-error')
    }
  })

  if (error === false) {
    createNewWorkItem(newWorkItem, function(err) {
      handleNewWorkItemClear()
    })
  }
}

function handleNewWorkItemClear(e, node) {
  if (e) e.preventDefault()
  $('input, textarea', (e ? e.target.parentNode : node)).each(function(idx) {
    $(this).val('')
    $(this.parentNode).removeClass('has-error')
  })

$("#checkbox1").prop('checked', true);
}

function createNewWorkItem(w, next) {
  var id = docs._id
  var rightNow = new Date()

  w.date = rightNow
  w.updated = rightNow
  w.applicationId = id

  xhr(w, 'POST', '/vettingworksheet/additem', function(err, data) {
    // TODO: Handle error
    if (err) { alert('There was an error saving your work item') }
    w._id = data.itemId
    workItems.push(w)
    var newNode = addWorkItem(w)
    handleNewWorkItemClear(null, $('[name="new"]'))

  })
}

function addWorkItem(w) {
  var cardContainer = $('#workItemCards')

  var cardDiv = $('<div></div>').addClass('col-xs-12').addClass('col-sm-6').addClass('col-md-9').addClass('float-to-right')
  .appendTo(cardContainer)

  var card = $('<div></div>').addClass('panel panel-default').addClass('work-item')
  .attr('name', w._id)
  .appendTo(cardDiv)

  var cardBlock = $('<div></div>').addClass('panel-body')
  .appendTo(card)


  $('<h4></h4>').addClass('card-title')
  .attr('name', w._id + '.name')
  .text(w.name)
  .appendTo(cardBlock)

  $('<p></p>').addClass('text-muted')
  .text(w.date.toString())
  .appendTo(cardBlock)

  var cardText = $('<p></p>').addClass('card-text')
  .appendTo(cardBlock)

  $('<strong>Description:</strong>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<span></span>')
  .attr('name', w._id + '.description')
  .text(w.description)
  .appendTo(cardText)

  $('<br></br>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<strong>Vetting Comments:</strong>').appendTo(cardText)
  // $('<br></br>').appendTo(cardText)

  $('<p></p>').attr('name', w._id + '.vettingComments').text(w.vettingComments).appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<strong>Site Comments:</strong>').appendTo(cardText)
  // $('<br></br>').appendTo(cardText)

  $('<p></p>').text(w.siteComments).appendTo(cardText)
  $('<br></br>').appendTo(cardText)

$('<strong>Project Comments:</strong>').appendTo(cardText)
  // $('<br></br>').appendTo(cardText)

  $('<p></p>').text(w.projectComments).appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<strong>Cost:</strong>').appendTo(cardText)
  $('<br></br>').appendTo(cardText)

  $('<span></span>')
  .attr('name', w._id + '.cost')
  .text(w.cost)
  .appendTo(cardText)

  $('<a></a>').addClass('btn').addClass('btn-primary')
  .addClass('card-link').addClass('work-item-edit')
  .text('Edit')
  .attr('href', '#')
  .on('click', showWorkItemEditForm)
  .appendTo(cardBlock)

  $('<a></a>').addClass('btn').addClass('btn-danger')
  .addClass('card-link').addClass('work-item-delete')
  .text('Delete')
  .attr('href', '#')
  .on('click', showWorkItemDeleteConfirm)
  .appendTo(cardBlock)

console.log("Output", w)


$('<input>&nbsp;Handle-it</input>').prop('checked', w.isHandle)
                            .attr('type', 'checkbox')
                            .attr('dataID', w._id)
                            .attr('data-name', "isHandle")
                            .addClass('isHandle').addClass('card-link')
                            .on('change',  function() {
                                  if ($(this).is(':checked')) {
                                    $(this).attr('value', 'true');

                                    var id = $(this).attr('dataID');
                                    console.log("ID is: ", id);

                                    var postUrl = '/edit/work/' + id;

                                    console.log("POST URL is: ", postUrl);

                                    var update = { "name": "isHandle", "value": true };

                                    xhr(update, 'POST', postUrl, function(err, data) {
                                    if (err) { alert('Could not Save, please refresh page.') }
                                    else {
                                      console.log("Checked - Success!");
                                      }
                                    
                                  })
                                    
                                  } else {

                                    $(this).attr('value', 'false');

                                    var id = $(this).attr('dataID');
                                    console.log("ID is: ", id);

                                    var postUrl = '/edit/work/' + id;

                                    console.log("POST URL is: ", postUrl);

                                    var update = { "name": "isHandle", "value": false };

                                    xhr(update, 'POST', postUrl, function(err, data) {
                                    if (err) { alert('Could not Save, please refresh page.') }
                                    else {
                                      console.log("Unchecked - Success!");
                                      }
                                    
                                  })

                                  }
                                  
                                })
                            .appendTo(cardBlock)


  return cardBlock
}


function showWorkItemDeleteConfirm(e) {
  e.preventDefault()
  var workItemParent = this.parentElement
  var workItemContainer = $(workItemParent)
  var workItemId = $(workItemParent.parentElement).attr('name')

  var currentData = {}
  $('[name*="' + workItemId + '"]', workItemContainer).each(function(idx) {
    var path = $(this).attr('name').replace(workItemId + '.', '')
    currentData[path] = this.innerText
  })

  workItemContainer.empty()

  $('<h4>Are you sure?</h4>').appendTo(workItemParent)
  $('<p>You are about to delete this work item. After selecting confirm, you '
    + 'will be unable to recover the item.</p>').appendTo(workItemParent)

  $('<a>Continue</a>').addClass('btn').addClass('btn-primary')
  .appendTo(workItemParent)
  .on('click', function(e) {
    deleteWorkItem(workItemId, workItemParent)
  })

  $('<a>Cancel</a>').addClass('btn').addClass('btn-danger')
  .appendTo(workItemParent)
  .on('click', function(e) {
    e.preventDefault()
    for (let i=0; i<workItems.length; i++) {
      if (workItems[i]._id === workItemId) {
        showWorkItem(workItems[i], workItemContainer)
      }
    }
  })
}

function deleteWorkItem(id, node) {
  xhr({itemId: id}, 'POST', '/vettingworksheet/deleteitem', function(err, data) {
    if (err) { alert('Unable to delete item') }
    else {
      var workItemRoot = $('[name="' + id + '"]')
      workItemRoot.remove()
      for (var i=0; i<workItems.length; i++) {
        if (workItems[i]._id == id) { workItems.splice(i, 1) }
      }
    }
  })
}

*/