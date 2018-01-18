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
  componentDidMount() {
    let allBookings = [];
    for (let time in this.state.booking) {
      const timeSplit = time.split('_')
      let formattedTime = timeSplit[0]

      if (timeSplit[1] === '0') {
        formattedTime += ':00'
      } else {
        formattedTime += ':30'
      }

      const bookingJSX = (
        <div key={time}>
          <h2>{formattedTime}</h2>
          <p>
            Service: {this.state.booking[time].service}
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
