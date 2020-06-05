  // SORT TABLE CODE --------------------------------------------------
  function orderTable(inTableClass, colmn) {
    var switchCnt = 0, rows, reverse;

    var curr = "ascending";
    var thisTable = document.getElementsByClassName(inTableClass)[0];
    var switching = true;

    var i, x, y;
    while (switching) {
        switching = false;
        rows = thisTable.getElementsByTagName("tr");

        for (i = 1; i < (rows.length - 1); i++) {
            reverse = false;
            x = rows[i].getElementsByTagName("td")[colmn];
            y = rows[i + 1].getElementsByTagName("td")[colmn];

            // Search using RegEx to app_name
            const app_name_regex = /A(\d+)-(\d+)/;
            if (x && y)  { // APP NAME
                var x_results = x.innerText.match(app_name_regex),
                    y_results = y.innerText.match(app_name_regex);
                if (x_results != null && y_results != null) {
                    console.log(x_results, y_results);
                    var x_year = parseInt(x_results[1]),
                        x_num = parseInt(x_results[2]),
                        y_year = parseInt(y_results[1]),
                        y_num = parseInt(y_results[2]);
                    if (curr == "ascending") {
                        // Compare Year & number after year
                        if ( (x_year > y_year) ||
                            ( x_year == y_year && (x_num > y_num))) {
                            reverse = true;
                            break;
                        }
                    } else if (curr == "descending") {
                        console.log("descending")
                        if ( (x_year < y_year) ||
                            ( x_year == y_year && (x_num < y_num))) {
                            reverse = true;
                            break;
                        }
                    }
                    continue; // skip the rest of check & move to next
                }
            }

            if (curr == "ascending") {
                if  (((x && x.attributes && x.attributes.fullDate && x.attributes.fullDate.value) || 
                        (x && x.innerText && x.innerText.toLowerCase()) || "") >
                    ((y && y.attributes && y.attributes.fullDate && y.attributes.fullDate.value) || 
                        (y && y.innerText && y.innerText.toLowerCase()) || "")
                    ) {
                        reverse = true;
                        break;
                }
            } else if (curr == "descending") {
                if (((x && x.attributes && x.attributes.fullDate && x.attributes.fullDate.value) || 
                        (x && x.innerText && x.innerText.toLowerCase()) || "") <
                    ((y && y.attributes && y.attributes.fullDate && y.attributes.fullDate.value) || 
                        (y && y.innerText && y.innerText.toLowerCase()) || "")
                   ) {
                        reverse = true;
                        break;
                }
            }
        }

        if (reverse) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCnt++;
        } else {
            if (switchCnt == 0 && curr == "ascending") {
            curr = "descending";
            switching = true;
            }
        }
    }
}
// -------------------------------------------------- END SORT TABLE CODE