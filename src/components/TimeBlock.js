import React from 'react'
import moment from 'moment'
import Modal  from 'react-modal'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { startCreateBooking } from '../actions/users'

class TimeBlock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      startTime: parseInt(props.user.settings.startTime),
      endTime: parseInt(props.user.settings.endTime),
      selectedService: '',
      dummyBookings: [],
      settings: props.user.settings,
      bookings: props.user.bookings,
      booking: {
        client: {
          name: '',
          email: '',
          phoneNumber: ''
        }
      },
      uid: props.uid,
      history: props.history,
      match: props.match,
      dispatch: props.dispatch,
      displayDate: '',
      bookingsSet: false,
      isModalOpen: false
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
    if (!!this.state.bookings) {
      for (let time in this.state.bookings[databaseDate]) {

        const numRequiredTime = parseInt(this.state.bookings[databaseDate][time].requiredTime)
        let hour = time.substring(0, time.indexOf('_'))
        const numBlocks = Math.floor((numRequiredTime/30))

        if (time.slice(-1) === '5') {
          if (numBlocks % 2 === 1 && numBlocks !== 1) {
            const endTime = parseInt(hour) + numBlocks - 1

            for (let i = hour; i<endTime; i++) {
              let firstHour = (i.toString()) + '_5'
              let secondHour = (parseInt(i)+1).toString() + '_0'

              if (i = endTime) {
                bookings.push(firstHour)
              } else {
                bookings.push(firstHour)
                bookings.push(secondHour)
              }
            }
          } else {
            const endTime = parseInt(hour) + numBlocks

            for (let i = hour; i<endTime; i++) {
              let firstHour = (i.toString()) + '_5'
              let secondHour = (parseInt(i)+1).toString() + '_0'

              if (i = endTime) {
                bookings.push(firstHour)
              } else {
                bookings.push(firstHour)
                bookings.push(secondHour)
              }
            }
          }
        } else {
          if (numBlocks % 2 === 1 && numBlocks !== 1) {
            const endTime = parseInt(hour) + numBlocks - 1

            for (let i = hour; i<endTime; i++) {
              let firstHour = (i.toString()) + '_0'
              let secondHour = (i.toString()) + '_5'

              if (i = endTime) {
                bookings.push(firstHour)
              } else {
                bookings.push(firstHour)
                bookings.push(secondHour)
              }
            }
          } else {
            const endTime = parseInt(hour) + numBlocks

            for (let i = hour; i<endTime; i++) {
              let firstHour = (i.toString()) + '_0'
              let secondHour = (i.toString()) + '_5'

              if (i = endTime) {
                bookings.push(firstHour)
              } else {
                bookings.push(firstHour)
                bookings.push(secondHour)
              }
            }
          }
        }
      }
    }
    return this.setState(() => ({displayDate, dummyBookings, bookings, bookingsSet: true}))
  }
  onTimeSelect = (e) => {
    const timeBlock = e.target.id
    const isModalOpen = true

    let databaseDate = this.state.match.params.year+this.state.match.params.month+this.state.match.params.day
    databaseDate = moment(databaseDate).format('YYYYMMMD')

    const time = timeBlock
    const date = databaseDate

    this.setState((prevState) => ({
      booking: {...prevState.booking, time, date},
      isModalOpen
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
  generateBlocks = () => {
    let blocks = [];

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
            <label onClick={this.onBlockSelect}>
              <span id='unchecked-block'><span id='checked-block'></span></span>
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
            <label onClick={this.onBlockSelect}>
              <span  id='unchecked-block'><span id='checked-block'></span></span>
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
              <label onClick={this.onBlockSelect}>
                <span  id='unchecked-block'><span id='checked-block'></span></span>
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
              <label onClick={this.onBlockSelect}>
                <span id='unchecked-block'><span id='checked-block'></span></span>
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
              <label onClick={this.onBlockSelect}>
                <span id='unchecked-block'><span id='checked-block'></span></span>
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
              <label onClick={this.onBlockSelect}>
                <span id='unchecked-block'><span id='checked-block'></span></span>
                {String(i + 0.5)}
              </label>
            </div>
          </div>
        )
        blocks.push(block)
      } else if (this.state.bookings.indexOf(id_0) > -1 && this.state.bookings.indexOf(id_5) > -1) {
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
              <label onClick={this.onBlockSelect}>
                <span id='unchecked-block'><span id='checked-block'></span></span>
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
              <label onClick={this.onBlockSelect}>
                <span id='unchecked-block'><span id='checked-block'></span></span>
                {String(i + 0.5)}
              </label>
            </div>
          </div>
        )
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
              <label onClick={this.onBlockSelect}>
                <span id='unchecked-block'><span id='checked-block'></span></span>
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
                <span id='unchecked-block'><span id='checked-block'></span></span>
                {String(i)}
              </label>
            </div>
          </div>
        )
        blocks.push(block)
      } else if (this.state.bookings.indexOf(id_0) === -1 && this.state.bookings.indexOf(id_5) === -1) {

        blocks.push(block)

      }
    }
    return blocks
  }
  onBlockSelect = (e) => {
    e.target.parentNode.firstChild.click()
  }
  createBooking = (e) => {
    e.preventDefault();

    this.state.dispatch(startCreateBooking(this.state.booking, this.state.uid)).then( () => {
      this.state.history.push(`/${this.state.uid}/dashboard`)
    })
  }
  generateServiceOptions = () => {
    const services = this.state.settings.services
    let options = []

    for (let i = 0; i<services.length; i++) {
      const serviceOption = (
        <option
          key={services[i].service}
          value={services[i].service}
        >
          {services[i].service}
        </option>
      );
      options.push(serviceOption)
    }
    return options
  }
  onModalClose = () => {
    this.setState( () => ({isModalOpen: false}))
  }
  onServiceSelect = (e) => {
    const selectedService = e.target.value
    let services = this.state.settings.services

    for (let i=0; i<services.length; i++) {
      if (services[i].service === selectedService) {
        services = services[i]
        break
      }
    }

    this.setState( (prevState) => ({
      selectedService,
      booking: {
        ...prevState.booking,
        service: services
      }
    }))
  }
  render() {
    return (
      <div>
        <h3>Bookings for {this.state.displayDate}</h3>
        <form>
          <input
            type='text'
            value={this.state.booking.client.name}
            onChange={this.onNameChange}
            placeholder='Name'
          />
          <input
            type='text'
            value={this.state.booking.client.email}
            onChange={this.onEmailChange}
            placeholder='Email'
          />
          <input
            type='text'
            value={this.state.booking.client.phoneNumber}
            onChange={this.onPhoneChange}
            placeholder='Phone # (optional)'
          />
        </form>
        <form onSubmit={this.createBooking}>
          {this.state.bookingsSet ? this.generateBlocks() : ''}
          <button>Create booking</button>
        </form>
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.onModalClose}
          aria={{
            labelledby: "heading",
            describedby: "full_description"
          }}>
          <h1 id="heading">Select your requires service</h1>
          <form>
            <select value={this.state.selectedService} onChange={this.onServiceSelect}>
              {this.state.isModalOpen ? this.generateServiceOptions() : ''}
            </select>
          </form>
          <div id="full_description">
          </div>
          <button onClick={this.onModalClose}>Submit Booking</button>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: state.users[props.uid]
})

export default withRouter(connect(mapStateToProps, undefined)(TimeBlock))
