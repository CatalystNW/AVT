$(document).ready(init);

function init() {

    $('#add_work_item').on('click', addItem);
    //since delete/update buttons are dynamically added, we use the table body ID to apply click listeners
    //the second parameter is the class name the click listener is applied to
    $('#work-body').on('click', '.delete-button', deleteItem);
    $('#work-body').on('click', '.update-button', setUpForm);
    $('#work-body').on('click', '.submit-update-button', updateItem);
    $('#work-body').on('click', '.cancel-button', cancelUpdate);

}

/**
 * When the add button is clicked, the following function is called
 *
 */
function addItem(e) {
    e.preventDefault(); //prevent page refresh/POST to this page

    //don't bother doing anything if text field was empty
    if($('#work_item_title').val() != "") {

        //otherwise, prepare payload with the application ID and the note contents
        var payload = {};
		payload.name = $('#work_item_title').val();
        payload.description = $('#work_item_description').val();
		payload.cost = $('#work_item_cost').val();
		payload.vettingComments = $('#work_item_vaComment').val();
        payload.applicationId = $('#appId').val();

        //POST the data to the database
        var posting = $.ajax({
            type : 'POST',
            url: "/vettingworksheet/additem",
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(payload)
        });
        posting.done(function (xhr) {
            if(xhr.status == 200) {
                //check if the 'empty notes' row exists and delete if so
                var emptyNotes = $('#empty-work_items');
				console.log("status 200");
                if(emptyNotes != null)
                {
                    emptyNotes.closest('tr').remove();
                }
				
                //build the new row
                //the date column to display
                var date = '<td>' + getDate() + '</td>';
                //new column for the new note
				var newName = '<td>' + $('#work_item_title').val() + '</td>';
                var newNote = '<td>' + $('#work_item_description').val() + '</td>';
				var newCost = '<td>' + $('#work_item_cost').val() + '</td>';
				var newComment = '<td>' + $('#work_item_vaComment').val() + '</td>';
                //need to get the new note ID so it is available for immediate update/deletion
                var hiddenNoteId = '<input type="hidden" value="' + xhr.workId + '" name="workId" />';
                //build delete button
				//var updateButton = '<button type="submit" class="update-button btn btn-info">Update Work Item</button>';
                var deleteButton = '<button type="submit" class="delete-button btn btn-danger">Delete Work Item</button>';
                //assemble all parts to build the new note row
                var newRow = '<tr class="success">' + date + newName + newNote + newCost + newComment + '<td><form>' + hiddenNoteId + deleteButton + '</form></td></tr>';
                //add new row before the very last row in the table (input form row)
                $('#work-body tr:last').before(newRow);
                //clear text area to prepare for new note
                $('#work_item_description').val("");
				$('#work_item_title').val("");
				$('#work_item_cost').val("");
				$('#work_item_vaComment').val("");
				
            }
            else{
                console.log("API submission for new work item failed");
            }
            // If code is not 200 forward below to .fail()
        });

        posting.fail(function (data)
        {
            console.log("ajax failed to POST data");
        });

    }
}

//delete item
function deleteItem(e) {
    e.preventDefault(); //prevent page refresh/POST
    //get the note ID from the nearest hidden input field
	console.log("In delete item");
    var itemId = $(this).closest("form").find("input[name='itemId']").val();
    //save note row object in variable
    var itemSelected = $(this);

    //payload needs the note id so it can be found and removed
    var payload = {};
    payload.itemId = itemId;

    var posting = $.ajax({
        type : 'POST',
        url: "/vettingworksheet/deleteitem",
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(payload)
    });
    posting.done(function (xhr) {
        if(xhr.status == 200) {
            //remove row on successful document deletion
            itemSelected.closest('tr').remove();
        }
        else{
            console.log("API did not return 200 status for deleting note");
        }
    });
    posting.fail(function (data)
    {
        console.log("Ajax POST failed");
    });

}

function setUpForm(e) {
    e.preventDefault();
	console.log("in setup form item");
	console.log(e);
    //the note we want will be the first child of the following search since it finds the closest <tr> to the button clicked
    var item_description = $(this).closest("tr").find(".item-descrip");
	var item_cost = $(this).closest("tr").find(".item-cost");
	var item_comment = $(this).closest("tr").find(".item-comments");
    //transform the text into a text area for editing
    item_description.html('<textarea id="item_desc" class="form-control desc-textarea" placeholder="Update Description Here...">' + item_description[0].innerText + '</textarea>');
	item_cost.html('<textarea id="item_ct" class="form-control cost-textarea" placeholder="Update Cost Here...">' + item_cost[0].innerText + '</textarea>');
	item_comment.html('<textarea id="item_cmmt" class="form-control cmmt-textarea" placeholder="Update Comment Here...">' + item_comment[0].innerText + '</textarea>');
    //change update note button to submit change button that will handle update submission
    $(this).val("Submit Update");
    $(this).attr("class", "submit-update-button btn btn-warning");
    //change delete button to cancel button to handle cancellation of updates
    var cancelButton = $(this).closest("td").find(".delete-button")
    cancelButton.val("Cancel");
    cancelButton.attr("class", "cancel-button btn btn-danger");
}

function updateItem(e) {
    e.preventDefault();
	console.log("in update item");
    //save items for after POST
	//var item_name = $(this).closest("tr").find(".item-name");
    var item_desc = $(this).closest("tr").find(".item-descrip");
	var item_cost = $(this).closest("tr").find(".item-cost");
	var item_comment = $(this).closest("tr").find(".item-comments");
	//the note row html object
    var updateButton = $(this);                                                 //associated update button
    var cancelButton = $(this).closest("td").find(".cancel-button");            //associated cancel button
    var itemId = $(this).closest("form").find("input[name='itemId']").val();    //associated note ID
    //using .value since innerHTML and others don't get updated when textarea is edited
    var itemDescrip = $(this).closest("tr").find(".desc-textarea")[0].value;
	var itemCost = $(this).closest("tr").find(".cost-textarea")[0].value;
	var itemComment = $(this).closest("tr").find(".cmmt-textarea")[0].value;

    //build payload with the note idea and new note description
    var payload = {};
    payload.description = itemDescrip;
	payload.cost = itemCost;
	payload.vettingComments = itemComment;
    payload.id = itemId;

    //POST the data to the database
    var posting = $.ajax({
        type : 'POST',
        url: "/vettingworksheet/updateitem",
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(payload)
    });
    posting.done(function (xhr) {
        if(xhr.status == 200) {
            //revert form into just text after success
            item_desc[0].innerHTML = itemDescrip;
			item_cost[0].innerHTML = itemCost;
			item_comment[0].innerHTML = itemComment;
            //revert buttonsby changing button value and class
            updateButton.val("Update Item");
            updateButton.attr("class", "update-button btn btn-info");
            cancelButton.val("Delete Item");
            cancelButton.attr("class", "delete-button btn btn-danger");
        }
        else{
            console.log("API did not return 200 status for updating note");
        }
        // If code is not 200 forward below to .fail()
    });

    posting.fail(function (data)
    {
        console.log("Ajax POST failed");
    });
}

/**
 * If cancel button is clicked, undo the changes made by setup form and revert buttons and their class names
 *
 */
function cancelUpdate(e){
    e.preventDefault();
    var item = $(this).closest("tr").find(".item-descrip");
    var itemDescrip = $(this).closest("tr").find(".desc-textarea")[0].innerHTML;
	var cost = $(this).closest("tr").find(".item-cost");
    var costDescrip = $(this).closest("tr").find(".cost-textarea")[0].innerHTML;
	var comment = $(this).closest("tr").find(".item-comments");
    var cmmtDescrip = $(this).closest("tr").find(".cmmt-textarea")[0].innerHTML;
    var cancelButton = $(this);
    var updateButton = $(this).closest("td").find(".submit-update-button");

    //revert form into just text
    item[0].innerHTML = itemDescrip;
	cost[0].innerHTML = costDescrip;
	comment[0].innerHTML = cmmtDescrip;
    //revert buttons
    updateButton.val("Update Item");
    updateButton.attr("class", "update-button btn btn-info");
    cancelButton.val("Delete Item");
    cancelButton.attr("class", "delete-button btn btn-danger");
}

//helper function to get date in a nice format
function getDate() {
    var date = new Date();
    var Year = date.getFullYear();
    var Day = ( "00" + date.getDate()).slice(-2);
    var Mon = ("00" + (date.getMonth()+1)).slice(-2);
    return Mon + "/" + Day + "/" + Year;
}


