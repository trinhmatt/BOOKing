import React from 'react'
import {connect} from 'react-redux'
import MyBookingsDisplay from './MyBookingsDisplay'

class MyBookings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: props.users.bookings,
      bookingsSet: false,
      bookingsJSX: []
    }
  }
  componentDidMount() {
    let bookingsJSX = []
    for (let date in this.state.bookings) {
      bookingsJSX.push((
        <MyBookingsDisplay
          date={date}
          booking={this.state.bookings[date]}
          key={date}
        />
      ))
    }
    bookingsJSX.reverse()
    this.setState( () => ({bookingsJSX}))
  }
  render() {
    return (
      <div>
        <h1>My Bookings</h1>
        {this.state.bookingsJSX}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  users: state.users[props.match.params.uid]
})

export default connect(mapStateToProps)(MyBookings);
