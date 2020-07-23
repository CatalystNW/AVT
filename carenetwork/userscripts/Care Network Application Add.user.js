// ==UserScript==
// @name         Care Network Application Add
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Andy Situ
// @match        http://localhost/carenetwork/application_form
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

    var r = document.getElementById("marital-radio-1");
    r.click();

    r = document.getElementById("waiver-radio-1");
    r.click();

    var inputs = document.getElementsByTagName("input");
    for (var i=0; i< inputs.length; i++) {
        if (inputs[i].type == "text") {
            if (inputs[i].name == "signature_date" || inputs[i].name == "dob") {
                inputs[i].value = "01-01-2020";
            }
            else if (inputs[i].type == "text") {
                inputs[i].value = generate_string(6);
            }
        } else if (inputs[i].type == "email") {
            inputs[i].value = generate_string(6) + "@" + generate_string(6);
        }
    }

    inputs = document.getElementsByTagName("textarea");
    for (i=0; i< inputs.length; i++) {
        inputs[i].value = generate_string(10);
    }
})();