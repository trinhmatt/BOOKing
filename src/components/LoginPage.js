import React from 'react'
import { connect } from 'react-redux'
import { startLogin } from '../actions/auth'
import UserForm from './UserForm'

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      startLogin: props.startLogin,
      history: props.history
    }
  }
  onEmailChange = (e) => {
    const email = e.target.value;
    this.setState( () => ({email}))
  }
  onPasswordChange = (e) => {
    const password = e.target.value;
    this.setState( () => ({password}))
  }
  render() {
    return (
      <div className='login-page'>
        <div id='small-icon'></div>
        <div id='user-form'>
            <h1 style={{marginBottom: 2 + 'vh'}}>BOOKing.</h1>
            <UserForm onSubmit={(user) => {
              const email = user.email
              const password = user.password
              const rememberMe = user.rememberMe
              this.state.startLogin(email, password, rememberMe)
            }}/>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLogin: (email, password, rememberMe) => dispatch(startLogin(email, password, rememberMe))
})

export default connect(undefined, mapDispatchToProps)(Login)
