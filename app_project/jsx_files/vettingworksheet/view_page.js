import { DocStatusBar } from "./DocStatusBar.js"

$(document).ready(init);

function init() {
    ReactDOM.render(
        <DocStatusBar appId={appId} status={docStatus} />, 
        document.getElementById("status-container"));
}