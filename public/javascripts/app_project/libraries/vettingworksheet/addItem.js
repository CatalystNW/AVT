import { WorkItem } from "/javascripts/app_project/workitem.js";
import { VettingWorkItemApp } from "./VettingWorkItemApp.js";

$(document).ready(init);

function init() {
    (function loadReact() {
        var appId = $('#appId').val();
        ReactDOM.render(React.createElement(VettingWorkItemApp, { appId: appId }), document.getElementById("workitem-create-menu-container"));
    })();
}