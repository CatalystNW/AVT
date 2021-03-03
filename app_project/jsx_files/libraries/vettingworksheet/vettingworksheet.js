import { VettingWorkItemApp } from "./VettingWorkItemApp.js"


$(document).ready(init);

function init() {    
    (function loadReact() {
        const appId = $('#appId').val();
        ReactDOM.render(<VettingWorkItemApp appId={appId} />, document.getElementById("workitem-create-menu-container"));
    })();
}