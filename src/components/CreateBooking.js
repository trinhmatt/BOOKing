import React from 'react'
import TimeBlock from './TimeBlock'
import { connect } from 'react-redux'


const CreateBooking = (props) => (
  <div>
    <h1>Create booking</h1>
    <TimeBlock uid={props.match.params.uid} />
  </div>
)


export default connect()(CreateBooking);
