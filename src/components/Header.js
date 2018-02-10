import React from 'react';
import { Menu, Button, Dropdown } from 'semantic-ui-react'
import { startLogOut } from '../actions/auth'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'


class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: '',
      auth: props.auth,
      startLogOut: props.startLogOut,
      history: props.history,
      match: props.match
    }
  }
  onHomeClick = (e, {name}) => {
    const uid = this.state.match.params.uid
    this.setState(() => ({activeItem: name}), this.state.history.push(`/${uid}/dashboard`))
  }
  onSignUp = () => {
    this.state.history.push('/register')
  }
  onLogin = () => {
    this.state.history.push('/')
  }
  render() {
    const {activeItem} = this.state
    return (
        <Menu className='nav-header' color={'blue'} inverted size='massive' stackable>
          <Menu.Item name='Home' active={activeItem === 'home'} onClick={this.onHomeClick}/>
          <p id='header-brand'></p>
          <Menu.Menu position='right'>
            {!this.state.auth.uid ?
              <Button.Group primary>
                <Button onClick={this.onSignUp}>Sign Up</Button>
                <Button onClick={this.onLogin}>Log in</Button>
              </Button.Group>
              : <Dropdown item text={this.state.auth.displayName || 'Anonymous'}>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={ () => this.state.history.push(`/${this.state.auth.uid}/bookings`)}>
                      My Bookings
                    </Dropdown.Item>
                    <Dropdown.Item onClick={ () => this.state.history.push(`/${this.state.auth.uid}/settings`)}>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item onClick={this.state.startLogOut}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            }
          </Menu.Menu>
        </Menu>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  startLogOut: () => dispatch(startLogOut())
})

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
