// ==UserScript==
// @name         Application Add
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Andy Situ
// @match        http://localhost/application/add
// @grant        none
// ==/UserScript==

function generate_string (size) {
    var charset = "abcdefghijklmnopqrstuvwxyz"
    var letters = [];
    for (var i=0; i < size; i++) {
        letters.push(charset[Math.floor(Math.random() * charset.length)]);
    }
    return letters.join('');
}

(function() {
    'use strict';

    var r = document.getElementsByName("owns_home");
    for (var i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }

    }

    r = document.getElementsByName("mortgage_up_to_date");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }
    }

    r = document.getElementsByName("advo_bool");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "false") {
            r[i].click();
        }
    }

    r = document.getElementsByName("military");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "false") {
            r[i].click();
        }
    }

    r = document.getElementsByName("language");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "English") {
            r[i].click();
        }
    }

    r = document.getElementsByName("contribute");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }
    }

    r = document.getElementsByName("relativeContribute");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }
    }

    r = document.getElementsByName("otherHelp");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }
    }

    r = document.getElementsByName("propertyType");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "Single Family Home") {
            r[i].click();
        }
    }

    r = document.getElementsByName("laborHelp");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }
    }

    r = document.getElementsByName("othersLaborHelp");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }
    }

    r = document.getElementsByName("fbo_help");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "true") {
            r[i].click();
        }
    }

    r = document.getElementsByName("mStatus");
    for (i=0; i< r.length; i++) {
        if (r[i].value == "Married") {
            r[i].click();
        }
    }

    var inputs = document.getElementsByTagName("input");
    for (i=0; i< inputs.length; i++) {
        if (inputs[i].type == "text") {
            if (inputs[i].name == "client_date" || inputs[i].name == "dob") {
                inputs[i].value = "01/01/2020";
            }
            else if (inputs[i].type == "text") {
                inputs[i].value = generate_string(6);
            }
        }
        else if (inputs[i].type == "email") {
            inputs[i].value = generate_string(6) + "@" + generate_string(6);
        }
    }

    inputs = document.getElementsByTagName("textarea");
    for (i=0; i< inputs.length; i++) {
        inputs[i].value = generate_string(10);
    }

    r = document.getElementsByName("tac-yes");
    for (i=0; i< r.length; i++) {
        r[i].click();
    }
})();