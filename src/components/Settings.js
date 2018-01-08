import React from 'react'
import { firebase } from '../firebase/firebase'
import { connect } from 'react-redux'

const Settings = (props) => {
  return (
    <div>
      <h1>Settings</h1>
      <div>
        <p>
          Username: {props.auth.displayName}
        </p>
        <p>Email: {props.auth.email}</p>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Settings);
