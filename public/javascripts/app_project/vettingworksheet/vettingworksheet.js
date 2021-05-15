import { VettingWorkItemApp } from "./VettingWorkItemApp.js";
import { DocStatusBar } from "./DocStatusBar.js";

$(document).ready(init);

function init() {
    var appId = $('#appId').val();
    ReactDOM.render(React.createElement(VettingWorkItemApp, { appId: appId }), document.getElementById("workitem-create-menu-container"));
    ReactDOM.render(React.createElement(DocStatusBar, { appId: appId, applicationStatus: applicationStatus }), document.getElementById("status-container"));
}