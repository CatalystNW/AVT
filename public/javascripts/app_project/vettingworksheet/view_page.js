import { DocStatusBar } from "./DocStatusBar.js";

$(document).ready(init);

function init() {
    ReactDOM.render(React.createElement(DocStatusBar, { appId: appId, applicationStatus: applicationStatus }), document.getElementById("status-container"));
}