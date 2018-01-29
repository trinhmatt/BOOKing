import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import { startDisableBookings }from '../actions/users'

class SetAvailability extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unavailableDays: {},
      startDate: null,
      endDate: null,
      //For DateRangePicker
      focusedInput: null,
      singleDate: null,
      //focused is for the SingleDatePicker, it will not work if I change the name of the variable
      focused: false,
      pickerToRender: '',
      dispatch: props.dispatch,
      uid: props.match.params.uid,
      history: props.history

    }
  }
  showCalendar = (e) => {
    const pickerToRender = e.target.id
    if (pickerToRender === 'oneDay') {
      this.setState( (prevState) => ({
        pickerToRender,
        //To clear the days of the other date picker
        startDate: null,
        endDate: null,
        unavailableDays: []
      }))
    } else {
      this.setState( (prevState) => ({
        pickerToRender,
        singleDate: null,
        unavailableDays: []
      }))
    }
  }
  onSingleDateChange = (singleDate) => {
    const date = moment(singleDate).format('MMM_DD_YYYY')
    const unavailableDays = {[date]: true};
    this.setState( () => ({
      singleDate,
      unavailableDays
    }))
  }

  onDateRangeChange = ({startDate, endDate}) => {
    this.setState( () => ({
      startDate,
      endDate
    }), this.dateRangeSet)
  }
  dateRangeSet = () => {
    const format = 'MMM_DD_YYYY'
    const formattedStartDate = moment(this.state.startDate).format(format)
    const formattedEndDate = moment(this.state.endDate).format(format)
    const unavailableDays = {[formattedStartDate]: true};
    let date = formattedStartDate;
    let daysToAdd = 1

    //Need this because DateRangeChange will fire even when the endDate has not been selected
      //But the startDate has been
    if (!!this.state.endDate) {
      while (date !== formattedEndDate) {
        date = moment(this.state.startDate).add(daysToAdd, 'days').format(format)
        unavailableDays[date] = true
        daysToAdd += 1
      }
      this.setState( () => ({unavailableDays}))
    }
  }
  confirmAvailability = () => {
    this.state.dispatch(startDisableBookings(this.state.unavailableDays, this.state.uid))
    this.state.history.push(`/${this.state.uid}/settings/availability/success`)
  }
  render() {
    return (
      <div>
        <h1>Set Availability</h1>
        <p>Please select an option to disable bookings on one or multiple days.</p>
        <div>
          <button id='oneDay' onClick={this.showCalendar}>Disable bookings for 1 day</button>
          <button id='multipleDays' onClick={this.showCalendar}>Disable bookings for more than 1 day</button>
        </div>
        {(this.state.pickerToRender === 'multipleDays') ? (
          <div>
            <h3>Unavailable for more than 1 day</h3>
            <DateRangePicker
              startDate={this.state.startDate}
              startDateId="unavailableStart"
              endDate={this.state.endDate}
              endDateId="unavailableEnd"
              onDatesChange={this.onDateRangeChange}
              focusedInput={this.state.focusedInput}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
              showClearDates={true}
            />
          </div>
        ) : ''}
        {(this.state.pickerToRender === 'oneDay') ? (
          <div>
            <h3>Unavailable for 1 day</h3>
            <SingleDatePicker
              date={this.state.singleDate} // momentPropTypes.momentObj or null
              onDateChange={this.onSingleDateChange} // PropTypes.func.isRequired
              focused={this.state.focused} // PropTypes.bool
              onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
            />
          </div>
        ) : ''}
        <button onClick={this.confirmAvailability}>Confirm availability</button>
      </div>
    )
  }
}



export default connect(undefined, undefined)(SetAvailability)
