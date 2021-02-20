export {VettingWorkItemApp}
import { WorkItem } from "../../workitem.js"
import { ModalMenu } from "../../modalmenu.js"

// props. appId: documentPackage/ application id
class VettingWorkItemApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workItems: [],
    };
    this.assessmentId = null;
    this.loadAssessment();
    this.formId = "workitem-create-form";
    this.modalmenu = React.createRef();
  }

  loadAssessment = () => {
    $.ajax({
      url: "/app_project//site_assessments/application/" + this.props.appId,
      context: this,
      type: "GET",
      success: function(assessment) {
        console.log(assessment);
        this.assessmentId = assessment._id;
        this.setState({
          workItems: assessment.workItems,
        });
      }
    });
  };

  onSubmit_createWorkItem = (e) => {
    e.preventDefault();
    if (this.assessmentId) {
      const data = this.getData();
      data.type = "assessment";
      data.assessment_id = this.assessmentId;
      $.ajax({
        url: "/app_project/workitems",
        type: "POST",
        data: data,
        context: this,
        success: function(workitem) {
          this.clearForm();
          this.setState({
            workItems: [...this.state.workItems, workitem],
          })
        }
      })
    }
  };

  clearForm = () => {
    const form = document.getElementById(this.formId);
    form.reset();
  }

  getData = () => {
    let data = {};
    let formData = new FormData($("#" + this.formId)[0]);
    formData.set("handleit", formData.get("handleit") == "on" ? true:false); 
    
    for (let key of formData.keys()) {
      data[key] = formData.get(key);
    }
    return data;
  }

  remove_workitem = (workitem_id) => {
    this.setState(state => {
      var new_workitems = [...state.workItems];
      for (let i=0; i< new_workitems.length; i++) {
        if (new_workitems[i]._id == workitem_id) {
          new_workitems.splice(i, 1);
          break;
        }
      }
      return {workItems: new_workitems}
    });
  };

  set_create_materialsitem_menu = (e, materialsitem_handler) => {
    var data = {
      workitem_id: e.target.getAttribute("workitem_id")
    }
    this.modalmenu.current.show_menu(
      "create_materialsitem",
      funkie.create_materialsitem,
      data,
      materialsitem_handler,
    );
  };

  set_edit_workitem_menu = (data, edit_workitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_workitem",
      funkie.edit_workitem,
      data,
      edit_workitem_handler
    );
  };

  set_edit_materialisitem_menu = (old_data, edit_materialsitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_materialsitem",
      funkie.edit_materialsitem,
      old_data,
      edit_materialsitem_handler, // <WorkItem> method
    );
  };

  render() {
    return (
    <div>
      <div className="col-xs-12 col-sm-6 col-md-3" >
        <h3>Add a Work Item</h3>
        <div className="panel panel-primary work-item" name="new">
          <div className="panel-body">
            <h4 className="card-title">New Work Item</h4>
            <form onSubmit={this.onSubmit_createWorkItem} id={this.formId}>
              <div className="card-text">
                <div className="form-group">
                  <label className="form-control-label">Name*</label>
                  <input type="text" className="form-control" name="name" required/>
                </div>
                <div className="form-group">
                  <label className="form-control-label">Description*</label>
                  <textarea className="form-control" name="description" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label className="form-control-label">Vetting Comments*</label>
                  <textarea className="form-control" name="vettingComments" rows="3" required></textarea>
                </div>
                <div className="form-group">
                  <label className="form-control-label">Handle-it</label>
                  <input type="checkbox" name="handleit" id="checkbox1" style={{"marginLeft": "10px; !important"}} />
                        </div>
              </div>
              <button type="submit" className="btn btn-primary card-link">Save</button>
              <button type="button" className="btn btn-danger card-link"
                onClick={this.clearForm}>Clear</button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-xs-12 col-sm-6 col-md-9">
			  <h3>Current Work Items</h3>
        {this.state.workItems.map(workItem => {
          return (
          <WorkItem key={workItem._id}
            workitem={workItem}
            remove_workitem={this.remove_workitem}
            set_edit_materialisitem_menu={this.set_edit_materialisitem_menu}
            set_create_materialsitem_menu={this.set_create_materialsitem_menu}
            set_edit_workitem_menu = {this.set_edit_workitem_menu}
          />)
        })}
      </div>

      <ModalMenu ref={this.modalmenu}/>
		</div>) ;   
  }
}

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