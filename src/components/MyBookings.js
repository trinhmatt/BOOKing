import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'
import { SingleDatePicker } from 'react-dates';
import MyBookingsDisplay from './MyBookingsDisplay'

class MyBookings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: props.users.bookings,
      bookingsSet: false,
      bookingsDict: [],
      bookingsToRender: [],
      calendarDate: moment(),
      selectedDate: null,
      calendarFocused: false
    }
  }
  componentDidMount() {
    this.setUpBookings();
  }
  setUpBookings = () => {
    let bookingsDict = [];
    let bookingsToRender = [];
    for (let date in this.state.bookings) {
      const formattedDate = moment(date, 'YYYYMMMDD').format('MMM Do, YYYY')

      //Need each component to be contained in an object so the user can filter
      //their bookings by date
      bookingsDict.push(
        {[date]: (
        <MyBookingsDisplay
          date={formattedDate}
          booking={this.state.bookings[date]}
          key={date}
        />
        )
      })

      bookingsToRender.push(
        (<MyBookingsDisplay
          date={formattedDate}
          booking={this.state.bookings[date]}
          key={date}
        />)
      )
    }
    //So the most recent bookings appear first
    bookingsToRender.reverse()
    this.setState( () => ({bookingsDict, bookingsToRender}))
  }
  onDateChange = (date) => {
    if (date) {
      const dictDate = moment(date._d).format('YYYYMMMDD')
      const calendarDate = moment(date._d)


      this.setState( () => ({selectedDate: dictDate, calendarDate}), this.filterBookings)
    } else {
      this.setUpBookings()
    }
  }
  onFocusChange = ({ focused }) => {
    this.setState(() => ({ calendarFocused: focused }));
  }
  filterBookings = () => {
    const filteredDict = this.state.bookingsDict.filter( (date) => {
      return !!(date[this.state.selectedDate])
    })

    if (!!filteredDict[0]) {
      const bookingsToRender = [(filteredDict[0][this.state.selectedDate])]

      this.setState( () => ({bookingsToRender}))
    } else {
      const bookingsToRender = []

      this.setState( () => ({bookingsToRender}))
    }
  }
  isDayBlocked = (day) => {
    //day === every availible day
    //need to check if day is equal to the days that the user has blocked
    // if (moment().isSame(day, 'day')) {
    //   console.log(day)
    //   return true
    // }
    if (moment(day).format('ddd') === 'Sat' || moment(day).format('ddd') === 'Sun') {
      return true
    }
  }
  render() {
    return (
      <div>
        <h1>My Bookings</h1>
        <SingleDatePicker
          date={this.state.calendarDate}
          showClearDate={true}
          onDateChange={this.onDateChange}
          focused={this.state.calendarFocused}
          onFocusChange={this.onFocusChange}
          numberOfMonths={1}
          isOutsideRange={() => false}
          isDayBlocked={this.isDayBlocked}
        />
        {this.state.bookingsToRender}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  users: state.users[props.match.params.uid]
})

export default connect(mapStateToProps)(MyBookings);
