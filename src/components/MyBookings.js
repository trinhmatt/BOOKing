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
      noBookings: false,
      calendarDate: moment(),
      selectedDate: moment(),
      calendarFocused: false,
      history: props.history,
      uid: props.uid
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
          history={this.state.history}
          uid={this.state.uid}
          key={date}
        />
        )
      })

      bookingsToRender.push(
        (<MyBookingsDisplay
          date={formattedDate}
          booking={this.state.bookings[date]}
          history={this.state.history}
          uid={this.state.uid}
          key={date}
        />)
      )
    }

    this.setState( (() => ({bookingsDict, bookingsToRender, noBookings: false})), this.onDateChange(this.state.selectedDate))
  }
  onDateChange = (date) => {
    if (date) {
      const dictDate = moment(date._d).format('YYYYMMMDD')
      const calendarDate = moment(date._d)


      this.setState( () => ({selectedDate: dictDate, calendarDate}), this.filterBookings)
    } else {
      this.setState( () => ({calendarDate: null}))
    }
  }
  onFocusChange = ({ focused }) => {
    this.setState(() => ({ calendarFocused: focused }));
  }
  filterBookings = () => {
    const filteredDict = this.state.bookingsDict.filter( (date) => {
      return !!(date[this.state.selectedDate])
    })

    if (filteredDict[0]) {
      const bookingsToRender = [(filteredDict[0][this.state.selectedDate])]

      this.setState( () => ({bookingsToRender, noBookings: false}))
    } else {
      const bookingsToRender = []

      if (bookingsToRender.length === 0) {
        this.setState( () => ({bookingsToRender, noBookings: true}))
      } else {
        this.setState( () => ({bookingsToRender, noBookings: false}))
      }
    }
  }
  render() {
    return (
      <div id='my-bookings'>
        <div id='my-bookings-header'>
          <h1>My Bookings</h1>
          <h2>Filter by date: </h2>
          <SingleDatePicker
            date={this.state.calendarDate}
            onDateChange={this.onDateChange}
            focused={this.state.calendarFocused}
            onFocusChange={this.onFocusChange}
            numberOfMonths={1}
            isOutsideRange={() => false}
          />
        </div>
        {this.state.bookingsToRender}
        {this.state.noBookings ? (
          <h2 style={{textAlign: 'center'}}>
            You have no bookings for {moment(this.state.calendarDate).format('MMMM Do, YYYY')}
          </h2>
        ) : ''}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  users: state.users[props.match.params.uid],
  uid: props.match.params.uid
})

export default connect(mapStateToProps)(MyBookings);
