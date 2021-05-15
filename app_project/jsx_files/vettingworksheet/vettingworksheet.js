import { VettingWorkItemApp } from "./VettingWorkItemApp.js"
import { DocStatusBar } from "./DocStatusBar.js"

$(document).ready(init);

function init() {    
    const appId = $('#appId').val();
    ReactDOM.render(
        <VettingWorkItemApp appId={appId} />, 
        document.getElementById("workitem-create-menu-container"));
    ReactDOM.render(
        <DocStatusBar appId={appId} applicationStatus ={applicationStatus} />, 
        document.getElementById("status-container"));
}