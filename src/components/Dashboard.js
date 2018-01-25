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
      history: props.history,
      match: props.match,
      dispatch: props.dispatch
    }
  }
  componentDidMount() {
    //Get the correct bookings and settings for the user
    const uid = this.state.match.params.uid
    this.state.dispatch(startGetSettings(uid))

    //Get the users displayName from firebase
    const displayName = firebase.auth().UserInfo('displayName')
    console.log
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

const mapStateToProps = (state, props) => ({
  users: state.users[props.match.params.uid]
})

export default connect(mapStateToProps, undefined)(Dashboard);
