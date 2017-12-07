import React from 'react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment'
import 'react-dates/lib/css/_datepicker.css';
import "react-dates/initialize"

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      date: moment(),
      formattedDate: '',
      calendarFocused: false,
      history: props.history
    }
  }
  onDateChange = (date) => {
    const formattedDate = moment(date._d).format('YYYY/MM/DD/')
    if (date) {
      this.setState(() => ({
        date
      }), this.state.history.push(`/booking/${formattedDate}`));
    }
  }
  onFocusChange = ({ focused }) => {
    this.setState(() => ({ calendarFocused: focused }));
  };
  render() {
    return (
      <div className='dashboard'>
        <h1>Dashboard</h1>
        <SingleDatePicker
          date={this.state.date}
          onDateChange={this.onDateChange}
          focused={this.state.calendarFocused}
          onFocusChange={this.onFocusChange}
          numberOfMonths={1}
        />
      </div>
    )
  }
}

export default Dashboard;
