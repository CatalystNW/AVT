import { DocStatusBar } from "./DocStatusBar.js";

$(document).ready(init);

function init() {
    ReactDOM.render(React.createElement(DocStatusBar, { appId: appId, status: docStatus }), document.getElementById("status-container"));
}