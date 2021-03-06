import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter, { history } from './routers/AppRouter'
import configureStore from './store/configureStore'
import { Provider } from 'react-redux'
import './styles/styles.scss'
import 'normalize.css/normalize.css'
import 'react-dates/lib/css/_datepicker.css'
import { firebase } from './firebase/firebase'
import { logIn, logOut } from './actions/auth'
import { startGetSettings } from './actions/users'

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

//For user auth, to ensure correct route behaviour
let hasRendered = false;

const renderApp = () => {
  if (!hasRendered) {
    store.dispatch(startGetSettings()).then( () => {
      ReactDOM.render(jsx, document.getElementById('app'));
      hasRendered = true;
    })
  }
};

firebase.auth().onAuthStateChanged( (user) => {
  if (user) {
    //Don't know why I can't dispatch logIn in the actions
    //Users cannot go anywhere without this line
    store.dispatch(logIn(user.uid, user.displayName, user.email))
    renderApp()
    if (history.location.pathname === '/login') {
      history.push(`/${user.uid}/dashboard`)
    }
  } else {

    //Check if a user signed out, if they did redirect to the landing
    //Need this so that anonymous users can still create bookings
    if (!!store.getState().auth.wasLoggedIn) {
      history.push('/')
      renderApp();
    }

    renderApp();
  }
})
