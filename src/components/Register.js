import React from 'react'
import {firebase} from '../firebase/firebase'
import UserForm from './UserForm'
import { startLogin } from '../actions/auth'

const Register = (props) => (
  <div id='register-container'>
    <div id='small-icon'></div>
    <div id='register'>
      <h1>Register</h1>
      <UserForm onSubmit={ (formUser) => {
        firebase.auth().createUserWithEmailAndPassword(formUser.email, formUser.password)
        .then( (user) => {
          user.updateProfile({displayName: formUser.username})
            .then( () => {
              props.history.push(`/register/success`)
            })
            .catch( (error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage)
            })
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
        });
      }}/>
    </div>
  </div>
)

export default Register;
