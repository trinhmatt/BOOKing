import { firebase, emailAuthProvider } from '../firebase/firebase'
import React from 'react'

export const logIn = (uid, displayName, email) => ({
  type: 'LOGIN',
  uid,
  displayName,
  email
})

export const startLogin = (email, password) => {
  return (dispatch) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch( (error) => {
        console.log(error.code, error.message)
      })

  }
}

export const logOut = () => ({
  type: 'LOGOUT'
})

export const startLogOut = () => {
  return (dispatch) => {
    firebase.auth().signOut().then( () => {
      dispatch(logOut())
    })
  }
}
