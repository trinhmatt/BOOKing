import { firebase, emailAuthProvider } from '../firebase/firebase'
import React from 'react'

export const logIn = (uid, displayName, email) => ({
  type: 'LOGIN',
  uid,
  displayName,
  email
})

export const startLogin = (email, password, rememberMe) => {
  return (dispatch) => {
    if (rememberMe) {
      firebase.auth().signInWithEmailAndPassword(email, password).then( (user) => {
        const uid = user.uid
        const displayName = user.displayName
        const email = user.email
      })
        .catch( (error) => {
          console.log(error.code, error.message)
        })
    } else {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          return firebase.auth().signInWithEmailAndPassword(email, password)
            .catch( (error) => {
              console.log(error.code, error.message)
            })
        })
    }
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
