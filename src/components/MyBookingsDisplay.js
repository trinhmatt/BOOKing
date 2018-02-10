import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import {startCancelBooking} from '../actions/users'


class MyBookingsDisplay extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      date: props.date,
      booking: props.booking,
      allBookings: '',
      isModalOpen: false,
      modalInfo: {
        client: '',
        time: ''
      },
      history: props.history,
      dispatch: props.dispatch,
      uid: props.uid,
      user: props.user
    }
  }
  componentDidMount() {
    let allBookings = [];

    for (let time in this.state.booking) {
      const bookingJSX = (
        <div key={time} id='booking-time'>
          <h2>{time}</h2>
          <button id={time} onClick={this.openModal}>Cancel Booking</button>
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
  openModal = (e) => {
    const time = e.target.id
    const booking = this.state.booking[time]
    const modalInfo = {
      client: booking.client.name,
      email: booking.client.email,
      time
    }

    this.setState( () => ({modalInfo, isModalOpen: true}))
  }
  closeModal = (e) => {
    this.setState( () => ({isModalOpen: false}))
  }
  confirmCancel = () => {
    const booking = {
      date: moment(this.state.date, 'MMM Do, YYYY').format('YYYYMMMDD'),
      time: this.state.modalInfo.time
    }

    // emailjs.send('gmail', 'cancel_confirmation', {
    //   "to_email": this.state.modalInfo.email,
    //   "from_name": this.state.user.displayName,
    //   "to_name": this.state.modalInfo.client,
    //   "cancel_date": this.state.date
    // })

    this.state.dispatch(startCancelBooking(booking, this.state.uid))
    this.state.history.push(`/${this.state.uid}/bookings/cancel`)

  }
  render() {
    return (
      <div id='booking-date'>
        <h1 id='booking-date-h1'>{this.state.date}</h1>
        {this.state.allBookings}
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Modal"
        >
          <h1>
            Confirm appointment cancellation with {this.state.modalInfo.client} at {this.state.modalInfo.time}?
          </h1>
          <button onClick={this.confirmCancel}>Confirm</button>
          <button onClick={this.closeModal}>Close Window</button>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.auth
})

export default connect(mapStateToProps)(MyBookingsDisplay);
