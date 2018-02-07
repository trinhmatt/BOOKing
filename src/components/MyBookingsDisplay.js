import React from 'react'


class MyBookingsDisplay extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      date: props.date,
      booking: props.booking,
      allBookings: ''
    }
  }
  cancelBooking = () => {
    this.setState( () => ({openCancelModal: true}))
  }
  componentDidMount() {
    let allBookings = [];
    for (let time in this.state.booking) {

      const bookingJSX = (
        <div key={time}>
          <h2>{time}</h2>
          <button onClick={this.cancelBooking}>Cancel Booking</button>
          <p>
            Service: {this.state.booking[time].service.service}
          </p>
          <p>
            Client Name: {this.state.booking[time].client.name}

            {this.state.booking[time].client.phoneNumber}
          </p>
          <p>Client Email: {this.state.booking[time].client.email}</p>
          {this.state.booking[time].client.phoneNumber ?
            <p>Client Phone Number: {this.state.booking[time].client.phoneNumber}</p> :
            ''
          }
        </div>
      )

      allBookings.push(bookingJSX)

    }
    this.setState( () => ({allBookings}))
  }
  render() {
    return (
      <div>
        <h1>{this.state.date}</h1>
        {this.state.allBookings}
      </div>
    )
  }
}


export default MyBookingsDisplay;
