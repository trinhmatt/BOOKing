import React from 'react'
import moment from 'moment'
import {withRouter} from 'react-router-dom'

class TimeBlock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      startTime: 9,
      endTime: 17,
      bookings: [],
      history: props.history,
      match: props.match,
      dispatch: props.dispatch,
      date: '',
      bookingsSet: false
    }
  }
  componentDidMount() {
    let date = this.state.match.params.year+this.state.match.params.month+this.state.match.params.day
    date = moment(date).format('dddd, MMMM Do YYYY')

    let bookings = [];
    for (let i=this.state.startTime; i<=this.state.endTime; i++) {
      const bookingBlock = {[i]: {
        first: '',
        second: ''
      }}
      bookings.push(bookingBlock)
    }
    return this.setState(() => ({date, bookings, bookingsSet: true}))
  }
  onTimeSelect = (e) => {
    const time = e.target.id
  }
  generateBlocks = () => {
    let blocks = [];
    for (let i=this.state.startTime; i<=this.state.endTime; i++) {
      const block = (
        <div className='hour' key={i}>
          <div className='first-half-hour'>
            <input
              type='checkbox'
              value={this.state.bookings[i-this.state.startTime].first}
              onClick={this.onTimeSelect}
              id={String(i)+'first'}
            />
            <label>
              <span><span></span></span>
              {String(i)}
            </label>
          </div>
          <div className='second-half-hour'>
            <input
              type='checkbox'
              value={this.state.bookings[i-this.state.startTime].second}
              onClick={this.onTimeSelect}
              id={String(i)+'second'}
            />
            <label>
              <span><span></span></span>
              {String(i + 0.5)}
            </label>
          </div>
        </div>
      )
      blocks.push(block)
    }
    return blocks
  }
  render() {
    return (
      <div>
        <h3>Bookings for {this.state.date}</h3>
        <form>
          {this.state.bookingsSet ? this.generateBlocks() : ''}
        </form>
      </div>
    )
  }
}

export default withRouter(TimeBlock)
