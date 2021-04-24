var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

export { functionHelper };

var functionHelper = {
  convert_date: function convert_date(old_date) {
    var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      var _result$slice = result.slice(1, 6),
          _result$slice2 = _slicedToArray(_result$slice, 5),
          year = _result$slice2[0],
          month = _result$slice2[1],
          date = _result$slice2[2],
          hours = _result$slice2[3],
          minutes = _result$slice2[4];

      return new Date(Date.UTC(year, parseInt(month) - 1, date, hours, minutes));
    }
    return null;
  },
  roundCurrency: function roundCurrency(n) {
    var mult = 100,
        value = void 0;
    value = parseFloat((n * mult).toFixed(6));
    return Math.round(value) / mult;
  }
};