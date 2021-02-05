export { DateMenuRow }

// Needs to use Bootstrap datepicker
// this.props: title, date, change_callback
class DateMenuRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      date: this.convert_date(this.props.date),
    }
    this.date_input = React.createRef();
  }

  convert_date(old_date) {
    var regex = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g,
        result = regex.exec(old_date);
    if (result) {
      let [year, month, date, hours, minutes] = result.slice(1,6);
      return new Date(Date.UTC(year, parseInt(month)-1  , date, hours, minutes));
    }
    return null;
  }

  get_data =() => {
    var obj = {
      date_type: this.props.date_type,
      year: this.state.date.getFullYear(),
      month: this.state.date.getMonth() + 1,
      day: this.state.date.getDate(),
      hours: this.state.date.getHours(),
      minutes: this.state.date.getMinutes(),
    };
    return obj;
  };
  set_date_from_dateInput = (value) => {
    var regex = /(\d{4})-(\d{2})-(\d{2})/g,
        result = regex.exec(value);
    if (result) { // Have to test since dates could be null
      var year = result[1],
          month = result[2] - 1,
          day = result[3];
      this.setState(state => {
        var new_date = new Date(this.state.date);
        new_date.setMonth(month);
        new_date.setFullYear(year);
        new_date.setDate(day);
        return {
          date: new_date,
        };
      }, () => {
        if (this.props.change_callback) {
          this.props.change_callback(this.get_data());
        }
      })
    }
  };
  set_time = (type, value) => {
    this.setState(state => {
      var new_date = new Date(state.date);
      if (type == "period") {
        if (value == "am") {
          new_date.setHours(new_date.getHours() - 12);
        } else {
          new_date.setHours(new_date.getHours() + 12);
        }
      } else if (type == "hours") {
        value = parseInt(value)
        if (new_date.getHours() > 12) {
          new_date.setHours(value + 12);
        } else {
          new_date.setHours(value);
        }
      } else {
        value = parseInt(value);
        new_date.setMinutes(value);
      }
      return {
        date: new_date,
      };
    }, () => {
      if (this.props.change_callback) {
        this.props.change_callback(this.get_data());
      }
    });
  };

  componentDidMount =() => {
    if (this.date_input) {
      $(this.date_input.current).datepicker({
        orientation: 'bottom',
        format: 'yyyy-mm-dd',
      }).on("hide", (e) => this.onChange_date(e));
    }
  };
  // Either change date or times
  onChange_date = (e) => {
    var name = e.target.name,
        value = e.target.value;
    if (name == "date") {
      this.set_date_from_dateInput(value);
    } else {
      this.set_time(name, value);
    }
  };

  create_hour_options(type) {
    var hours = [];
    for(var i=0; i<12;i++) {
      hours.push([
        <option key={"hour-"+i} value={i}>{i >= 10 ? String(i) : "0" + String(i)}</option>
      ]);  
    }
    return hours
  }
  create_minute_options() {
    var minutes = [];
    for(var i=0; i<60;i++) {
      minutes.push([
        <option key={"min-"+i} value={i}>{i >= 10 ? String(i) : "0" + String(i)}</option>
      ]);
    }
    return minutes;
  }

  render() {
    var d = this.state.date;
    var date_string = (this.state.date) ?
      `${d.getFullYear()}-${
        parseInt(d.getMonth())+1 > 9 ? parseInt(d.getMonth())+1 : "0" + (parseInt(d.getMonth())+1)}-${
          parseInt(d.getDate()) > 9 ? d.getDate() : "0" + d.getDate()}` :
      "";

    var hour = "";
    if (this.state.date) {
      hour = this.state.date.getHours();
      if (hour >= 12) {
        hour -= 12;
      }
    }
    var period = "";
    if (this.state.date) {
      period = (this.state.date.getHours() >= 12) ?
        "pm" : "am";
    }
    var minute = (this.state.date) ?
          this.state.date.getMinutes() : "";

    var hours = this.create_hour_options("start"),
        minutes = this.create_minute_options();

    return (
    <div className="form-group row">
      <div className="form-group row col-md-6 col-sm-12">
        <label className="col-sm-5 col-form-label">{this.state.title}</label>
        <div className="col-sm-7">
          <input type="text" className="form-control checklist-dateinput" 
            name="date" placeholder="yyyy-mm-dd"
            value={date_string}
            ref={this.date_input}
            onChange={this.onChange_date}></input>
        </div>
      </div>
      <div className="form-group row col-md-6 col-sm-12">
        <label className="col-sm-2 col-form-label" htmlFor="start-hour-select">
          Time</label>
        <div className="col-sm-10">
          <div className="form-inline">
            <select className="form-control"
              onChange={this.onChange_date} 
              value={hour} name="hours">
              {hours}
            </select>
            <select className="form-control"
              onChange={this.onChange_date} 
              value={minute} name="minutes">
              {minutes}
            </select>
            <select className="form-control"
              onChange={this.onChange_date} 
              value={period} name="period">
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </select>
          </div>
        </div>
      </div>
    </div>);
  }
}