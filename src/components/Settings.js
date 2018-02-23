import React from 'react'
import { firebase } from '../firebase/firebase'
import { connect } from 'react-redux'

const Settings = (props) => {
  return (
    <div id='settings-container'>
      <h1>Settings</h1>
      <div id='settings-title-break'></div>
      <div>
        <button onClick={ () => props.history.push(`/${props.auth.uid}/settings/changeusername`)}>
          Change username
        </button>
        <button onClick={ () => props.history.push(`/${props.auth.uid}/settings/changepassword`)}>
          Change password
        </button>
        <button onClick={ () => props.history.push(`/${props.auth.uid}/settings/availability`)}>
          Set availability
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Settings);
