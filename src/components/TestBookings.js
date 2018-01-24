import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import { startCreateBooking } from '../actions/users'

class TestBookings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: props.user.settings.startTime,
      endTime: props.user.settings.endTime,
      selectedService: props.user.settings.services.filter( (service) => {
        return service.service === props.selectedService
      }),
      availableTimes: [],
      booking: {
        client: {
          name: '',
          email: '',
          phoneNumber: ''
        }
      },
      timesSet: false,
      match: props.match,
      user: props.user,
      dispatch: props.dispatch,
      history: props.history,
      auth: props.auth,
      error: ''
    }
  }
  componentDidMount() {
    //Set up variables to render time radio buttons
    let availableTimes = [];
    let startTime = moment(this.state.startTime, 'HH:mm')
    const endTime = moment(this.state.endTime, 'HH:mm')
    let requiredTime = parseInt(this.state.selectedService[0].requiredTime);

    //To display the date and set up the date for the database
    let displayDate = this.state.match.params.year+this.state.match.params.month+this.state.match.params.day
    const databaseDate = moment(displayDate).format('YYYYMMMDD')
    displayDate = moment(displayDate).format('dddd, MMMM Do YYYY')

    while (true) {
      let time = moment(startTime).format('HH:mm');
      availableTimes.push(time);
      startTime.add(requiredTime, 'minutes');
      if (moment(startTime).format('HH') === this.state.endTime) {
        break
      }
    }

    for (let bookingTime in this.state.user.bookings[databaseDate]) {
      const startofBooking = moment(bookingTime, 'HH:mm')
      const requiredCurrentBookingTime = this.state.user.bookings[databaseDate][bookingTime].service.requiredTime
      let endOfBooking = moment(bookingTime, 'HH:mm').add(requiredCurrentBookingTime, 'minutes')
      availableTimes = availableTimes.filter((time) => {
        return !(
          moment(time, 'HH:mm').isBetween(startofBooking, endOfBooking, 'minute') ||
            moment(time, 'HH:mm').isSame(startofBooking)
        )
      })

      availableTimes.forEach( (time) => {
        console.log(time, moment(time, 'HH:mm').isBetween(startofBooking, endOfBooking, 'minute'))
        console.log(time, moment(time, 'HH:mm').isSame(startofBooking))
      })

      // console.log(moment('09:01', 'HH:mm').isBetween(startofBooking, endOfBooking, 'minute'))
    }


    this.setState( (prevState) => ({
      availableTimes,
      timesSet: true,
      booking: {
        ...prevState.booking,
        service: {
          service: prevState.selectedService[0],
          time: ''
        },
        date: databaseDate
      },
      displayDate
    }))

  }
  onNameChange = (e) => {
    const name = e.target.value

    this.setState( (prevState) => ({booking: {
      ...prevState.booking,
      client: {
        ...prevState.booking.client,
        name
      }
    }}))
  }
  onEmailChange = (e) => {
    const email = e.target.value

    this.setState( (prevState) => ({booking: {
      ...prevState.booking,
      client: {
        ...prevState.booking.client,
        email
      }
    }}))
  }
  onPhoneChange = (e) => {
    const phoneNumber = e.target.value

    this.setState( (prevState) => ({booking: {
      ...prevState.booking,
      client: {
        ...prevState.booking.client,
        phoneNumber
      }
    }}))
  }
  onTimeSelect = (e) => {
    const time = e.target.value;

    this.setState( (prevState) => ({
      booking: {
        ...prevState.booking,
        service: {
          ...prevState.booking.service,
          time
        }
      }
    }))
  }
  onSubmitBooking = () => {
    if (this.state.booking.client.email && this.state.booking.client.name) {
      //message_html for booking_template = the time of the appointment
      //..For new_appointment = Name and email of the client

      let bookingDetails = (
        `${this.state.booking.service.service} on ${this.state.displayDate} at ${this.state.booking.service.time}`
      )

      if (!!this.state.booking.client.phoneNumber) {
        bookingDetails += ` (${this.state.booking.client.phoneNumber})`
      }

      emailjs.send('gmail', 'booking_template', {
        "to_email": this.state.booking.client.email,
        "from_name": this.state.auth.displayName,
        "to_name": this.state.booking.client.name,
        "message_html": this.state.booking.service.time
      })

      emailjs.send('gmail', 'new_appointment', {
        "to_email": this.state.auth.email,
        "from_name": this.state.booking.client.name,
        "to_name": this.state.auth.displayName,
        "message_html": bookingDetails
      })

      this.state.dispatch(startCreateBooking(this.state.booking, this.state.user.settings.uid)).then( () => {
        this.state.history.push(`/${this.state.user.settings.uid}/confirmation`)
      })
    } else {
      this.setState( () => ({error: 'Please provide your email and name'}))
    }
  }
  render() {
    return (
      <div>
        <h1>
          Test Bookings
        </h1>
        <h3>{this.state.displayDate}</h3>
        <p>{this.state.error}</p>
        <form>
          <input
            type='text'
            placeholder='Name'
            value={this.state.booking.client.name}
            onChange={this.onNameChange}
          />
          <input
            type='text'
            placeholder='Email'
            value={this.state.booking.client.email}
            onChange={this.onEmailChange}
          />
          <input
            type='text'
            placeholder='Phone Number (Optional)'
            value={this.state.booking.client.phoneNumber}
            onChange={this.onPhoneChange}
          />
        </form>
        <form>
          {this.state.timesSet ? (this.state.availableTimes.map( (time) => (
            <div key={time}>
              <input
                type='radio'
                value={time}
                name='time'
                onClick={this.onTimeSelect}
              />
              <p>{time}</p>
            </div>
          ))) : ''}
        </form>
        <button onClick={this.onSubmitBooking}>Submit Booking</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, undefined)(TestBookings)
