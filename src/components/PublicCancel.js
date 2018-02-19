import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import {startCancelBooking} from '../actions/users'

class PublicCancel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      uid: props.match.params.uid,
      bookingID: props.match.params.bookingID,
      bookingDate: props.match.params.date,
      booking: props.booking,
      user: props.user,
      dispatch: props.dispatch
    }
  }
  componentDidMount() {

    const formattedDate = moment(this.state.bookingDate, 'YYYYMMMDD').format('dddd, MMMM Do YYYY')

    // emailjs.send('gmail', 'cancel_confirmation', {
    //   "to_email": this.state.user.email,
    //   "from_name": this.state.booking.client.name,
    //   "to_name": this.state.user.displayName,
    //   "cancel_date": formattedDate
    // })

    this.state.dispatch(startCancelBooking(this.state.bookingDate, this.state.uid, this.state.bookingID))
  }
  render() {
    return (
      <div>
        <h1>
          Your appointment has been cancelled.
        </h1>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  booking: state.users[props.match.params.uid].bookings[props.match.params.date][props.match.params.bookingID],
  user: state.users[props.match.params.uid].settings
})

export default connect(mapStateToProps, undefined)(PublicCancel);
