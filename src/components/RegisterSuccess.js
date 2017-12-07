import React from 'react'
import { connect } from 'react-redux'
import {firebase} from '../firebase/firebase'
import { startSetServices } from '../actions/users'

class RegisterSuccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: firebase.auth().currentUser,
      startTime: '',
      endTime: '',
      services: [],
      nServices: 0,
      dispatch: props.dispatch,
      history: props.history
    }
  }
  onStartChange = (e) => {
    const startTime = e.target.value

    this.setState( () => ({startTime}))
  }
  onEndChange = (e) => {
    const endTime = e.target.value

    this.setState( () => ({endTime}))
  }
  onServiceChange = (e) => {
    const serviceID = e.target.id
    const service = e.target.value

    this.setState( (prevState) => {
      let allServices = prevState.services
      allServices[serviceID].service = service
      return {services: allServices}
    })
  }
  onRequiredTimeChange = (e) => {
    const serviceID = e.target.id
    const requiredTime = e.target.value

    this.setState( (prevState) => {
      let allServices = prevState.services
      allServices[serviceID].requiredTime = requiredTime
      return {services: allServices}
    })
  }
  generateServicesInput = () => {
    let servicesInputs = []
    for (let i=0; i<this.state.nServices; i++) {
      const input = (
        <div>
          <input
            type='text'
            value={this.state.services[i].service}
            onChange={this.onServiceChange}
            placeholder='Service'
            id={i}
          />
          <input
            type='text'
            value={this.state.services[i].requiredTime}
            onChange={this.onRequiredTimeChange}
            placeholder='Required Time to Complete'
            id={i}
          />
        </div>
      )
      servicesInputs.push(input)
    }
    return servicesInputs
  }
  submitUserSettings = () => {
    const services = {
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      services: this.state.services
    }
    this.state.dispatch(startSetServices(services)).then( () => {
      this.state.history.push('/dashboard')
    })
  }
  render() {
    return (
      <div>
        <h1>Welcome {this.state.user.displayName}</h1>
        <form>
          <h3>Please specify your operating hours (24h)</h3>
          <select value={this.state.startTime} onChange={this.onStartChange}>
            <option value='0'>Midnight</option>
            <option value='1'>1:00</option>
            <option value='2'>2:00</option>
            <option value='3'>3:00</option>
            <option value='4'>4:00</option>
            <option value='5'>5:00</option>
            <option value='6'>6:00</option>
            <option value='7'>7:00</option>
            <option value='8'>8:00</option>
            <option value='9'>9:00</option>
            <option value='10'>10:00</option>
            <option value='11'>11:00</option>
          </select>
          <label>AM</label>
          <select value={this.state.endTime} onChange={this.onEndChange}>
            <option value='12'>Noon</option>
            <option value='13'>1:00</option>
            <option value='14'>2:00</option>
            <option value='15'>3:00</option>
            <option value='16'>4:00</option>
            <option value='17'>5:00</option>
            <option value='18'>6:00</option>
            <option value='19'>7:00</option>
            <option value='20'>8:00</option>
            <option value='21'>9:00</option>
            <option value='22'>10:00</option>
            <option value='23'>11:00</option>
          </select>
          <label>PM</label>
        </form>
        <form>
          <h3>Please list the services you offer and their estimated completion time (in minutes)</h3>
          {this.state.nServices ? this.generateServicesInput() : ''}
        </form>
        <button onClick={() => {
          this.setState((prevState) => {
            const service = {
              service: '',
              requiredTime: '0'
            }
            return {
              nServices: prevState.nServices + 1,
              services: [...prevState.services, service]
            }
          })
        }}>Add Service</button>
        <button onClick={ () => {
          this.submitUserSettings()
        }}>Submit</button>
      </div>
    )
  }
}


export default connect(undefined, undefined)(RegisterSuccess)
