import React from 'react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment'
import { connect } from 'react-redux'
import { firebase } from '../firebase/firebase'
import 'react-dates/lib/css/_datepicker.css';
import "react-dates/initialize"
import { startGetSettings } from '../actions/users'


class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      date: moment(),
      formattedDate: '',
      calendarFocused: false,
      user: props.user,
      history: props.history,
      match: props.match,
      dispatch: props.dispatch
    }
  }
  componentDidMount() {
    //Reload to fetch the correct settings from database if user just created the account
    if (!this.state.user.settings) {
      window.location.reload()
    }
  }
  onDateChange = (date) => {
    const formattedDate = moment(date._d).format('YYYY/MM/DD')
    const uid = this.state.match.params.uid
    if (date) {
      this.setState(() => ({
        date
      }), this.state.history.push(`/${uid}/${formattedDate}/selectservice`));
    }
  }
  onFocusChange = ({ focused }) => {
    this.setState(() => ({ calendarFocused: focused }));
  }
  isDayBlocked = (day) => {
    let isBlocked;
    const dayString = moment(day).format('dddd').toLowerCase()
    const dateString = moment(day).format('MMM_DD_YYYY')

    //Check if the user has set any days as unavailable
    //If not check regular operating hours
    if (this.state.user.settings.unavailableDays) {
      //Check if the user set the specific day as unavailable before checking if
      //the day is an operating day or not
      if (this.state.user.settings.unavailableDays[dateString]) {
        return true
      } else if (this.state.user.settings.availability[dayString]){
        return false
      } else {
        return true
      }
    } else if (this.state.user.settings.availability[dayString]){
      return false
    } else {
      return true
    }
  }
  render() {
    return (
      <div className='dashboard'>
        <h1>Book an appointment with {this.state.user.settings ? this.state.user.settings.displayName : ''}</h1>
        <div id='dashboard-line-break'></div>
        <h2>Click on the calendar to select an available date</h2>
        <SingleDatePicker
          date={this.state.date}
          onDateChange={this.onDateChange}
          focused={this.state.calendarFocused}
          onFocusChange={this.onFocusChange}
          isDayBlocked={this.isDayBlocked}
          numberOfMonths={1}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: state.users[props.match.params.uid]
})

export default connect(mapStateToProps, undefined)(Dashboard);
