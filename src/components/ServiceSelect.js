import React from 'react'
import moment from 'moment'
import {connect} from 'react-redux'
import CreateBookings from './CreateBookings'

class ServiceSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      selectedService: '',
      isSelected: false,
      history: props.history,
      match: props.match
    }
  }
  onServiceSubmit = (e) => {
    e.preventDefault();

    this.setState( () => ({isSelected: true}))

  }
  onRadioSelect = (e) => {
    const selectedService = e.target.value

    this.setState( () => ({selectedService}))
  }
  render() {
    return (
      <div id='service-select'>
        {this.state.isSelected ? (
          <div>
            <CreateBookings
              user={this.state.user}
              selectedService={this.state.selectedService}
              match={this.state.match}
              history={this.state.history}
            />
          </div>
        ) : (
          <div>
            <h1 style={{paddingTop: (2 + 'vh'), marginBottom: 2 + 'vh'}}>Service Select</h1>
            <form onSubmit={this.onServiceSubmit}>
              {this.state.user.settings.services.map( (service) => (
                <div id='service-input' key={service.service}>
                  <input
                    type='radio'
                    name='service'
                    id={service.service}
                    value={service.service}
                    onClick={this.onRadioSelect}
                  />
                  <label htmlFor={service.service}> {service.service} ({service.requiredTime} minutes)</label>
                </div>
                ))}
              <button disabled={!this.state.selectedService}>Select</button>
            </form>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: state.users[props.uid]
})

export default connect(mapStateToProps)(ServiceSelect);
