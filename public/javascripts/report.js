function validDateCheck(dateArray){
    for(const element of dateArray){
        if(element && isNaN(Date.parse(element))){
            return false;
        }
    }
    return true;
}


$(function() { 
    //AJAX handlers for search function
  $("#exportButton").on("click", function(){
      let queryList = []
      let firstName = $("#FirstName").val();
      if(firstName) queryList.push("firstName=" + firstName)
      let lastName = $("#LastName").val();
      if(lastName) queryList.push("lastName=" + lastName)
      let city = $("#City").val();
      if(city) queryList.push("city=" + city)
      let zipcode = $("#ZipCode").val();
      if(zipcode) queryList.push("zipcode=" + zipcode)
      let site_host = $('#site_host').val();
      if(site_host) queryList.push("site_host=" + site_host)
      let crew_chief = $('#crew_chief').val();
      if(crew_chief) queryList.push("crew_chief=" + crew_chief)
      let project_advocate = $('#project_advocate').val();
      if(project_advocate) queryList.push("project_advocate=" + project_advocate)
      let numVol = $('#numVol').val();
      if(numVol) queryList.push("numVol=" + numVol)
      let totCost = $('#totCost').val();
      if(totCost) queryList.push("totCost=" + totCost)
      let appFromDate = $('#appFrom').val()
      if(appFromDate) queryList.push("appFromDate=" + appFromDate)
      let appToDate = $('#appTo').val()
      if(appToDate) queryList.push("appToDate=" + appToDate)
      let projStartFromDate = $('#projStartFrom').val()
      if(projStartFromDate) queryList.push("projStartFrom=" + projStartFromDate)
      let projStartToDate = $('#projStartTo').val()
      if(projStartToDate) queryList.push("projStartTo=" + projStartToDate)
      let projEndFromDate = $('#projEndFrom').val()
      if(projEndFromDate) queryList.push("projEndFrom=" + projEndFromDate)
      let projEndToDate = $('#projEndTo').val()
      if(projEndToDate) queryList.push("projEndTo=" + projEndToDate)
      let leader_andor = $(".and_or:checked").val()
      let totCost_range = $(".totCost:checked").val()
      let numberVol_range = $(".numberVol:checked").val()
      queryList.push("totCost_range=" + totCost_range)
      queryList.push("numberVol_range=" + numberVol_range)
      queryList.push("leader_and_or=" + leader_andor)
      $('#tableContent').empty();
      if(!validDateCheck([appFromDate, appToDate, 
            projStartFromDate, projStartToDate, projEndFromDate, projEndToDate])){
          return;
      }
      let queryString = "?" + queryList.join("&")
      //Send AJAX request
    $.ajax({
        url: "/projectreport/search" + queryString, 
        type: 'GET',
        success: function(data){
            if(!data.length){
                //If there is no response, 
                let row = $("<tr></tr>")
                let emptyResultsEle = $("<td></td>").text("No results for that search")
                row.append(emptyResultsEle)
                $("#tableContent").append(row)
            }
            data.forEach(element => {
                let row = $("<tr></tr>")
                let name = $("<td></td>")
                let link = element.project ? "/projectview/" + element._id : "/view/" + element._id
                let projLink = $("<a></a>").attr("href", link)
                projLink.text(element.application.name.first + " " + element.application.name.last)
                projLink.attr('target', '_blank');
                projLink.attr('rel', 'noopener noreferrer');
                name.append(projLink)
                let status = $("<td></td>").text(element.status)      
                let appName = $("<td></td>").text(element.app_name)
                let loc = $("<td></td>").text(element.application.address.city + ", " + element.application.address.state)
                row.append(name, loc, status, appName)
                $("#tableContent").append(row)
                $('#searchHidden').css("display", "block")
            })
        },
        error: function(data) {
            let row = $("<tr></tr>")
            let emptyResultsEle = $("<td></td>").text("There was an error with your search")
            row.append(emptyResultsEle)
             $("#tableContent").append(row)
        }
    });
  })
  $('#exportAppEnd').on("click",function(){
    let queryList = []
    let appFromDateSum = $('#appFromSum').val()
    if(appFromDateSum) {queryList.push("appFromSum=" + appFromDateSum)}
    let appEndDateSum = $('#appToSum').val()
    if(appEndDateSum) {queryList.push("appToSum=" + appEndDateSum)}
    let queryString = "?" + queryList.join("&")
    if(!$('#iframe').length) {
            $('#iframeHolder1').html('<iframe id="iframe1" src="projectreport/endReportAppExport' + queryString + '" frameborder="0" width="100%" height="100%"></iframe>');
            $('#exportAppEnd').hide();
            $("html").animate({ scrollTop: 0 }, "slow");
    }
  });

  $('#exportProjectEnd').on("click",function(){
    let queryList = []
    let projFromDateSum = $('#projStartFromSum').val()
    if(projFromDateSum) {queryList.push("projFromSum=" + projFromDateSum)}
    let projToDateSum = $('#projStartToSum').val()
    if(projToDateSum) {queryList.push("projToSum=" + projToDateSum)}
    let queryString = "?" + queryList.join("&")
    if(!$('#iframe').length) {
            $('#iframeHolder2').html('<iframe id="iframe2" src="projectreport/endReportProjExport' + queryString + '" frameborder="0" width="100%" height="100%"></iframe>');
            $('#exportProjectEnd').hide();
            $("html").animate({ scrollTop: 0 }, "slow");
    }
  });

  $('#exportUpcomingBtn').on("click",function(){
    if(!$('#iframe').length) {
            $('#iframeHolder3').html('<iframe id="iframe3" src="projectreport/upComingExport" frameborder="0" width="100%" height="100%"></iframe>');
            $('#exportUpcomingBtn').hide();
            $("html").animate({ scrollTop: 0 }, "slow");
    }
  });

    //Handler for end report submission button click
  $("#EndSubmitP").on("click", function(){
      //Build up query from submitted fields
      let queryList = []
      let projFromDateSum = $('#projStartFromSum').val()
      if(projFromDateSum) {queryList.push("projFromSum=" + projFromDateSum)}
      let projToDateSum = $('#projStartToSum').val()
      if(projToDateSum) {queryList.push("projToSum=" + projToDateSum)}
      let queryString = "?" + queryList.join("&")
      $('#projectCountTable').empty();
      $('#assocPartnerTableP').empty();
      $('#total_cost').empty()
      $('#total_volunteers').empty()
       if(!validDateCheck([projFromDateSum, projToDateSum])){
          return;
      }
      //submit query to end report endpoint
      $.ajax({
          url: "/projectreport/endReportProj" + queryString,
          type: 'GET',
          success: function(data){
            data.projCount.forEach(element => {
                if (element.projCount){
                    let row = $("<tr></tr>")
                    let partnerName = $("<td></td>").text(element.org_name)
                    let projCount = $("<td></td>").text(element.projCount)
                    row.append(partnerName, projCount)
                    $("#projectCountTable").append(row)
                }
            });
            data.projTable.forEach(element => {
                let row = $("<tr></tr>")
                let status = 'status' in element.project ? element.project.status : ''
                if (status.includes("handle")){
                    row.addClass('orange')
                }
                else {
                    row.addClass('blue')
                }
                let firstName = element.application.name.preferred ? element.application.name.preferred : element.application.name.first
                let projectName = $("<td></td>")
                let projectLink = $(`<a href=\'/projectview/${element._id}\'>${firstName} ${element.application.name.last}</a>`)
                projectLink.attr('target', '_blank');
                projectLink.attr('rel', 'noopener noreferrer');
                projectName.append(projectLink)
                let startDate = $("<td></td>").text(element.project.project_start)
                let location = $("<td></td>").text(element.application.address.city)
                let workItems = $("<td></td>")
                element.workItemDoc.forEach((item, i) => {
                    workItems.append('<p>' + (i + 1) + ') ' + item.name + '</p>')
                })
                if (!element.workItemDoc.length){
                    workItems.text('No work items')
                }
                let crew_chief = $("<td></td>").text(element.project.crew_chief)
                let project_advocate = $("<td></td>").text(element.project.project_advocate)
                let site_host = $("<td></td>").text(element.project.site_host)
                let partnerList = $("<td></td>").addClass("cell-overflow")
                element.partnerPack.forEach((partner, idx, arr) => {
                    partnerList.append(partner.org_name)
                    if (idx !== arr.length - 1){partnerList.append(", ")}
                })
                if (!element.partnerPack.length)partnerList.append("No partners for this project")
                let total_cost = $("<td></td>").text(element.project.actual_cost)
                let volunteers = $("<td></td>").text(element.project.actual_volunteer_count)
                let labor_count = $("<td></td>").text(element.project.actual_labor_count)
                row.append(projectName, startDate, location, workItems, crew_chief, project_advocate, site_host, partnerList, total_cost, volunteers, labor_count)
                $("#assocPartnerTableP").append(row)
            })
            $("#total_volunteers").text(data.total_volunteers)
            $("#total_cost").text("$" + data.total_cost)
            $("#total_labor_count").text(data.total_labor_count)
            $('#projReportHidden').css("display", "block")
        },
        error: function(data){
            alert("There was an error generating the report")
        }
      })
  });

  $("#EndSubmitA").on("click", function(){
    //Build up query from submitted fields
    let queryList = []
    let appFromDateSum = $('#appFromSum').val()
    if(appFromDateSum) {queryList.push("appFromSum=" + appFromDateSum)}
    let appEndDateSum = $('#appToSum').val()
    if(appEndDateSum) {queryList.push("appToSum=" + appEndDateSum)}
    let queryString = "?" + queryList.join("&")
    $('#assocPartnerTableA').empty();
    $('#est_cost').empty()
    $('#est_volunteers').empty()
     if(!validDateCheck([appFromDateSum, appEndDateSum])){
        return;
    }
    //submit query to end report endpoint
    $.ajax({
        url: "/projectreport/endReportApp" + queryString,
        type: 'GET',
        success: function(data){
          data.projTable.forEach(element => {
              let row = $("<tr></tr>")
              let estimates = element.assessment.estimates
              let firstName = element.application.name.preferred ? element.application.name.preferred : element.application.name.first
              let applicationDate =  $("<td></td>").text(element.signature.client_date)
              let projectName = $("<td></td>")
              let projectLink = $(`<a href=\'/view/${element._id}\'>${firstName} ${element.application.name.last}</a>`)
              projectLink.attr('target', '_blank');
              projectLink.attr('rel', 'noopener noreferrer');
              projectName.append(projectLink)
              let location = $("<td></td>").text(element.application.address.city)
              let workItems = $("<td></td>")
              element.workItemDoc.forEach((item, i) => {
                workItems.append('<p>' + (i + 1) + ') ' + item.name + '</p>')
              })
              if (!element.workItemDoc.length){
                workItems.text('No work items')
              }
              let crew_chief = $("<td></td>").text(element.project.crew_chief)
              let project_advocate = $("<td></td>").text(element.project.project_advocate)
              let site_host = $("<td></td>").text(element.project.site_host)
              let total_cost = $("<td></td>").text('total_cost' in estimates ? estimates.total_cost : 'None specified')
              let volunteers = $("<td></td>").text('volunteers_needed' in estimates ? estimates.volunteers_needed : 'None specified')
              row.append(projectName, applicationDate, location, workItems, crew_chief, project_advocate, site_host, total_cost, volunteers)
              $("#assocPartnerTableA").append(row)
          })
          $("#est_cost").text("$" + data.total_cost)
          $("#est_volunteers").text(data.total_volunteers)
          $('#appReportHidden').css("display", "block")
      },
      error: function(data){
          alert("There was an error generating the report")
      }
    })
  });
}); 