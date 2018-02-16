import React from 'react'
import {connect} from 'react-redux'
import {startCancelBooking} from '../actions/users'

class PublicCancel extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      uid: props.match.params.uid,
      bookingID: props.match.params.bookingID,
      bookingDate: props.match.params.date,
      dispatch: props.dispatch
    }
  }
  componentDidMount() {
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

export default connect(undefined, undefined)(PublicCancel);
