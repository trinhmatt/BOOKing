import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'
import {startCreateBooking} from '../actions/users'

class TimeBlock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      startTime: parseInt(props.user.settings.startTime),
      endTime: parseInt(props.user.settings.endTime),
      dummyBookings: [],
      bookings: props.user.bookings,
      booking: {},
      uid: props.uid,
      history: props.history,
      match: props.match,
      dispatch: props.dispatch,
      displayDate: '',
      bookingsSet: false
    }
  }
  componentDidMount() {
    let displayDate = this.state.match.params.year+this.state.match.params.month+this.state.match.params.day
    const databaseDate = moment(displayDate).format('YYYYMMMD')
    displayDate = moment(displayDate).format('dddd, MMMM Do YYYY')

    let dummyBookings = [];
    let bookings = [];

    //To ensure correct behaviour of radio buttons
    for (let i=this.state.startTime; i<=this.state.endTime; i++) {
      const bookingBlock = {[i]: {
        first: '',
        second: ''
      }}
      dummyBookings.push(bookingBlock)
    }
    //Need to know which times are already booked
    for (let time in this.state.bookings[databaseDate]) {
      bookings.push(time)
    }

    return this.setState(() => ({displayDate, dummyBookings, bookings, bookingsSet: true}))
  }
  onTimeSelect = (e) => {
    const timeBlock = e.target.id

    let databaseDate = this.state.match.params.year+this.state.match.params.month+this.state.match.params.day
    databaseDate = moment(databaseDate).format('YYYYMMMD')

    const booking = {
      time: timeBlock,
      service: 'test service',
      date: databaseDate
    }
    this.setState(() => ({booking}))
  }
  generateBlocks = () => {
    let blocks = [];
    const bookedBlocks = () => {
      let bookings = []
      for (let time in this.state.bookings) {
        bookings.push(this.state.bookings[time])
      }
      return bookings
    }

    //WARNING: SUPER SPAGHETTI
    //Check if the time slot is taken, if it is, disable the corresponding input
    for (let i=this.state.startTime; i<=this.state.endTime; i++) {
      let id_0 = String(i)+'_0'
      let id_5 = String(i)+'_5'
      let block = (
        <div className='hour' key={i}>
          <div className='first-half-hour'>
            <input
              type='radio'
              value={this.state.dummyBookings[i-this.state.startTime].first}
              onClick={this.onTimeSelect}
              id={String(i)+'_0'}
              name='time'
            />
            <label>
              <span><span></span></span>
              {String(i)}
            </label>
          </div>
          <div className='second-half-hour'>
            <input
              type='radio'
              value={this.state.dummyBookings[i-this.state.startTime].second}
              onClick={this.onTimeSelect}
              id={String(i)+'_5'}
              name='time'
            />
            <label>
              <span><span></span></span>
              {String(i + 0.5)}
            </label>
          </div>
        </div>
      )
      if (this.state.bookings.indexOf(id_0) > -1 && this.state.bookings.indexOf(id_5) === -1) {
        block = (
          <div className='hour' key={i}>
            <div className='first-half-hour'>
              <input
                type='radio'
                value={this.state.dummyBookings[i-this.state.startTime].first}
                onClick={this.onTimeSelect}
                id={String(i)+'_0'}
                disabled
                checked
              />
              <label>
                <span><span></span></span>
                {String(i)}
              </label>
            </div>
            <div className='second-half-hour'>
              <input
                type='radio'
                value={this.state.dummyBookings[i-this.state.startTime].second}
                onClick={this.onTimeSelect}
                id={String(i)+'_5'}
                name='time'
              />
              <label>
                <span><span></span></span>
                {String(i + 0.5)}
              </label>
            </div>
          </div>
        )
        blocks.push(block)
      } else if (this.state.bookings.indexOf(id_0) === -1 && this.state.bookings.indexOf(id_5) > -1) {
        block = (
          <div className='hour' key={i}>
            <div className='first-half-hour'>
              <input
                type='radio'
                value={this.state.dummyBookings[i-this.state.startTime].first}
                onClick={this.onTimeSelect}
                id={String(i)+'_0'}
                name='time'
              />
              <label>
                <span><span></span></span>
                {String(i)}
              </label>
            </div>
            <div className='second-half-hour'>
              <input
                type='radio'
                value={this.state.dummyBookings[i-this.state.startTime].second}
                onClick={this.onTimeSelect}
                checked
                disabled
              />
              <label>
                <span><span></span></span>
                {String(i + 0.5)}
              </label>
            </div>
          </div>
        )
        blocks.push(block)
      } else if (this.state.bookings.indexOf(id_0) === -1 && this.state.bookings.indexOf(id_5) === -1) {

        blocks.push(block)

      } else if (i === this.state.endTime && this.state.bookings.indexOf(id_0) === -1) {
        block = (
          <div className='hour' key={i}>
            <div className='first-half-hour'>
              <input
                type='radio'
                value={this.state.dummyBookings[i-this.state.startTime].first}
                onClick={this.onTimeSelect}
                id={String(i)+'_0'}
                name='time'
              />
              <label>
                <span><span></span></span>
                {String(i)}
              </label>
            </div>
          </div>
        )
        blocks.push(block)
      } else if (i === this.state.endTime && this.state.bookings.indexOf(id_0) > -1) {
        block = (
          <div className='hour' key={i}>
            <div className='first-half-hour'>
              <input
                type='radio'
                value={this.state.dummyBookings[i-this.state.startTime].first}
                onClick={this.onTimeSelect}
                checked
                disabled
              />
              <label>
                <span><span></span></span>
                {String(i)}
              </label>
            </div>
          </div>
        )
        blocks.push(block)
      } else {
        blocks.push(block)
      }
    }
    return blocks
  }
  createBooking = (e) => {
    e.preventDefault();

    this.state.dispatch(startCreateBooking(this.state.booking, this.state.uid)).then( () => {
      this.state.history.push(`/${this.state.uid}/dashboard`)
    })
  }
  render() {
    return (
      <div>
        <h3>Bookings for {this.state.displayDate}</h3>
        <form onSubmit={this.createBooking}>
          {this.state.bookingsSet ? this.generateBlocks() : ''}
          <button>Create booking</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: state.users[props.uid]
})

export default withRouter(connect(mapStateToProps, undefined)(TimeBlock))
