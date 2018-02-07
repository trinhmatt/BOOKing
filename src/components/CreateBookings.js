import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import { startCreateBooking } from '../actions/users'

class CreateBookings extends React.Component {
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

    //Set up initial times based on the operating hours of the user
    while (true) {
      let time = moment(startTime).format('HH:mm');
      availableTimes.push(time);
      startTime.add(requiredTime, 'minutes');
      if (moment(startTime).format('HH') === this.state.endTime) {
        break
      }
    }

    //Filter out the times where bookings have already been created, if any
    if (!!this.state.user.bookings) {
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
      }
    }

    //Check if there are available times, do not render form and submit button if none
    if (availableTimes.length > 0) {
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
    } else {
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
        displayDate,
        noTimesAvailable: true
      }))
    }
  }
  setAvailableTimes = () => {
    const availableTimes = this.state.availableTimes.map( (time) => (
      <div key={time}>
        <input
          type='radio'
          value={time}
          name='time'
          onClick={this.onTimeSelect}
        />
        <p>{time}</p>
      </div>
    ))
    if (availableTimes.length === 0) {
      return (
        <div>
          <h2>There are no available times today</h2>
          <p>Please return to the dashboard to select a new time.</p>
        </div>
      )
    } else {
      return availableTimes
    }
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
    const emailRegTest = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    if (this.state.booking.client.email && this.state.booking.client.name && this.state.booking.service.time) {

      if (!emailRegTest.test(this.state.booking.client.email)) {
        return this.setState( () => ({error: 'Please enter a valid email address'}))
      }

      //message_html for booking_template = the time of the appointment
      //..For new_appointment = Name and email of the client
      //TO DO: Connect the Gmail API to the service

      let bookingDetails = (
        `${this.state.booking.service.service.service} on ${this.state.displayDate} at ${this.state.booking.service.time}`
      )

      if (!!this.state.booking.client.phoneNumber) {
        bookingDetails += ` (${this.state.booking.client.phoneNumber})`
      }

      // emailjs.send('gmail', 'booking_template', {
      //   "to_email": this.state.booking.client.email,
      //   "from_name": this.state.auth.displayName,
      //   "to_name": this.state.booking.client.name,
      //   "message_html": this.state.booking.service.time
      // })
      //
      // emailjs.send('gmail', 'new_appointment', {
      //   "to_email": this.state.auth.email,
      //   "from_name": this.state.booking.client.name,
      //   "to_name": this.state.auth.displayName,
      //   "message_html": bookingDetails
      // })

      this.state.dispatch(startCreateBooking(this.state.booking, this.state.user.settings.uid)).then( () => {
        this.state.history.push(`/${this.state.user.settings.uid}/confirmation`)
      })
    } else if (!this.state.booking.client.email || !this.state.booking.client.name){
      this.setState( () => ({error: 'Please provide your email and name'}))
    } else {
      this.setState( () => ({error: 'Please select a time'}))
    }
  }
  render() {
    return (
      <div>
        <h1>
          Bookings for {this.state.displayDate}
        </h1>
        <p>{this.state.error}</p>
        {this.state.noTimesAvailable ? '' : (
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
        )}
        <form>
          {this.state.timesSet ? this.setAvailableTimes() : ''}
        </form>
        {this.state.noTimesAvailable ? '' : (
          <button onClick={this.onSubmitBooking}>Submit Booking</button>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, undefined)(CreateBookings)
