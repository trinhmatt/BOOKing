//For changing username, changepassword

import React from 'react'
import { firebase } from '../firebase/firebase'
import { connect } from 'react-redux'

class UpdateUserForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.match.params.uid,
      match: props.match,
      auth: props.auth,
      history: props.history,
      oldSetting: '',
      newSetting: '',
      confirmPass: '',
      error: ''
    }
  }
  componentDidMount() {
    //for conditional rendering
    if (this.state.match.path.indexOf('username') === -1) {
      this.setState( () => ({currentPage: 'password'}))
    } else {
      this.setState( () => ({currentPage: 'username'}))
    }
  }
  onOldChange = (e) => {
    const oldSetting = e.target.value

    this.setState( () => ({oldSetting}))
  }
  onNewChange = (e) => {
    const newSetting = e.target.value

    this.setState( () => ({newSetting}))
  }
  onConfirmPassChange = (e) => {
    const confirmPass = e.target.value;

    this.setState( () => ({confirmPass}))
  }
  onChangeSubmit = (e) => {
    e.preventDefault();
    const user = firebase.auth().currentUser

    if (this.state.currentPage === 'password') {

      const email = this.state.auth.email
      const password = this.state.oldSetting
      let cred = firebase.auth.EmailAuthProvider.credential(
          email,
          password
      );

      user.reauthenticateWithCredential(cred)
        .then( () => {
          if (this.state.newSetting !== this.state.confirmPass) {
            this.setState(() => ({error: 'Passwords do not match, please try again.'}))
          } else {
            user.updatePassword(this.state.newSetting)
              .then( () => {
                this.state.history.push(`/${this.state.uid}/settings/changeconfirm`)
              })
              .catch( (error) => {
                this.setState(() => ({error: error.message}))
              })
          }
        })
        .catch( (error) => {
          this.setState(() => ({error: 'The current password was incorrect, please try again.'}))
        });
    } else {
      if (this.state.oldSetting === this.state.auth.displayName) {
        user.updateProfile({displayName: this.state.newSetting})
          .then( () => {
            this.state.history.push(`/${this.state.uid}/settings/changeconfirm`)
          })
          .catch( (error) => {
            this.setState(() => ({error: error.message}))
          })
      } else {
        this.setState( () => ({error: 'Incorrect username, please try again.'}))
      }

    }
  }
  render() {
    return (
      <div id='update-user-form'>
        {this.state.error}
        <form onSubmit={this.onChangeSubmit}>
          <input
            type={this.state.currentPage === 'password' ? 'password' : 'text'}
            value={this.state.oldSetting}
            onChange={this.onOldChange}
            placeholder={this.state.currentPage === 'password' ? 'Current password' : 'Current username'}
          />
          <input
            type={this.state.currentPage === 'password' ? 'password' : 'text'}
            value={this.state.newSetting}
            onChange={this.onNewChange}
            placeholder={this.state.currentPage === 'password' ? 'New password' : 'New username'}
          />
          {this.state.currentPage === 'password' ?
            <input
              type='password'
              value={this.state.confirmPass}
              onChange={this.onConfirmPassChange}
              placeholder='Confirm password'
            /> : '' }
          <button>Confirm change</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(UpdateUserForm);
