var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { DateMenuRow };

// Needs to use Bootstrap datepicker
// this.props: title, date, change_callback

var DateMenuRow = function (_React$Component) {
  _inherits(DateMenuRow, _React$Component);

  function DateMenuRow(props) {
    _classCallCheck(this, DateMenuRow);

    var _this = _possibleConstructorReturn(this, (DateMenuRow.__proto__ || Object.getPrototypeOf(DateMenuRow)).call(this, props));

    _this.get_data = function () {
      var obj = {
        date_type: _this.props.date_type,
        year: _this.state.date.getFullYear(),
        month: _this.state.date.getMonth(),
        day: _this.state.date.getDate(),
        hours: _this.state.date.getHours(),
        minutes: _this.state.date.getMinutes()
      };
      return obj;
    };

    _this.set_date_from_dateInput = function (value) {
      var regex = /(\d{4})-(\d{2})-(\d{2})/g,
          result = regex.exec(value);
      if (result) {
        // Have to test since dates could be null
        var year = result[1],
            month = parseInt(result[2]) - 1,
            day = result[3];
        _this.setState(function (state) {
          var new_date = void 0;
          if (state.date) {
            new_date = new Date(state.date);
            new_date.setMonth(month);
            new_date.setFullYear(year);
            new_date.setDate(day);
          } else {
            new_date = new Date(year, month, day);
          }

          return {
            date: new_date
          };
        }, function () {
          if (_this.props.change_callback) {
            _this.props.change_callback(_this.get_data());
          }
        });
      }
    };

    _this.set_time = function (type, value) {
      _this.setState(function (state) {
        var new_date = new Date(state.date);
        if (type == "period") {
          if (value == "am") {
            new_date.setHours(new_date.getHours() - 12);
          } else {
            new_date.setHours(new_date.getHours() + 12);
          }
        } else if (type == "hours") {
          value = parseInt(value);
          // PM
          if (new_date.getHours() >= 12) {
            if (value == 12) {
              new_date.setHours(12);
            } else {
              new_date.setHours(value + 12);
            }
            // AM
          } else {
            if (value == 12) {
              new_date.setHours(0);
            } else {
              new_date.setHours(value);
            }
          }
        } else {
          value = parseInt(value);
          new_date.setMinutes(value);
        }
        return {
          date: new_date
        };
      }, function () {
        if (_this.props.change_callback) {
          _this.props.change_callback(_this.get_data());
        }
      });
    };

    _this.componentDidMount = function () {
      if (_this.date_input) {
        $(_this.date_input.current).datepicker({
          orientation: 'bottom',
          format: 'yyyy-mm-dd'
        }).on("hide", function (e) {
          return _this.onChange_date(e);
        });
      }
    };

    _this.onChange_date = function (e) {
      var name = e.target.name,
          value = e.target.value;
      if (name == "date") {
        _this.set_date_from_dateInput(value);
      } else {
        _this.set_time(name, value);
      }
    };

    _this.state = {
      title: _this.props.title,
      date: _this.convert_date(_this.props.date)
    };
    _this.date_input = React.createRef();
    return _this;
  }

  _createClass(DateMenuRow, [{
    key: "convert_date",
    value: function convert_date(old_date) {
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
    }
    /**
     * Sets the date state to the appropriate value
     * @param {String} type period, hours,  minutes
     * @param {*} value value of the time type
     */

    // Either change date or times

  }, {
    key: "create_hour_options",
    value: function create_hour_options() {
      var hours = [];
      for (var i = 1; i < 13; i++) {
        hours.push([React.createElement(
          "option",
          { key: "hour-" + i, value: i },
          i >= 10 ? String(i) : "0" + String(i)
        )]);
      }
      return hours;
    }
  }, {
    key: "create_minute_options",
    value: function create_minute_options() {
      var minutes = [];
      for (var i = 0; i < 60; i++) {
        minutes.push([React.createElement(
          "option",
          { key: "min-" + i, value: i },
          i >= 10 ? String(i) : "0" + String(i)
        )]);
      }
      return minutes;
    }
  }, {
    key: "render",
    value: function render() {
      var d = this.state.date;
      var date_string = this.state.date ? d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1 > 9 ? parseInt(d.getMonth()) + 1 : "0" + (parseInt(d.getMonth()) + 1)) + "-" + (parseInt(d.getDate()) > 9 ? d.getDate() : "0" + d.getDate()) : "";

      var period = "";
      if (this.state.date) {
        period = this.state.date.getHours() >= 12 ? "pm" : "am";
      }
      var hour = "";
      if (this.state.date) {
        hour = this.state.date.getHours();
        if (hour == 0) {
          hour = 12;
        } else if (hour > 12) {
          hour -= 12;
        }
      }
      var minute = this.state.date ? this.state.date.getMinutes() : "";

      var hours = this.create_hour_options(),
          minutes = this.create_minute_options();

      return React.createElement(
        "div",
        { className: "form-group row" },
        React.createElement(
          "div",
          { className: "form-group row col-md-6 col-sm-12" },
          React.createElement(
            "label",
            { className: "col-sm-5 col-form-label" },
            this.state.title
          ),
          React.createElement(
            "div",
            { className: "col-sm-7" },
            React.createElement("input", { type: "text", className: "form-control checklist-dateinput",
              name: "date", placeholder: "yyyy-mm-dd",
              value: date_string,
              ref: this.date_input,
              onChange: this.onChange_date })
          )
        ),
        React.createElement(
          "div",
          { className: "form-group row col-md-6 col-sm-12" },
          React.createElement(
            "label",
            { className: "col-sm-2 col-form-label", htmlFor: "start-hour-select" },
            "Time"
          ),
          React.createElement(
            "div",
            { className: "col-sm-10" },
            React.createElement(
              "div",
              { className: "form-inline" },
              React.createElement(
                "select",
                { className: "form-control",
                  onChange: this.onChange_date,
                  value: hour, name: "hours" },
                hours
              ),
              React.createElement(
                "select",
                { className: "form-control",
                  onChange: this.onChange_date,
                  value: minute, name: "minutes" },
                minutes
              ),
              React.createElement(
                "select",
                { className: "form-control",
                  onChange: this.onChange_date,
                  value: period, name: "period" },
                React.createElement(
                  "option",
                  { value: "am" },
                  "AM"
                ),
                React.createElement(
                  "option",
                  { value: "pm" },
                  "PM"
                )
              )
            )
          )
        )
      );
    }
  }]);

  return DateMenuRow;
}(React.Component);