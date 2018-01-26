import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { Router, Route, Switch } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import Dashboard from '../components/Dashboard'
import Register from '../components/Register'
import RegisterSuccess from '../components/RegisterSuccess'
import Login from '../components/LoginPage'
import Settings from '../components/Settings'
import MyBookings from '../components/MyBookings'
import ServiceSelectPage from '../components/ServiceSelectPage'
import BookingConfirmation from '../components/BookingConfirmation'
import SetAvailability from '../components/SetAvailability'


export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path='/' component={Login} exact={true} />
        <PublicRoute path='/:uid/dashboard' component={Dashboard} exact={true} />
        <PublicRoute path='/:uid/:year/:month/:day/selectservice' component={ServiceSelectPage} />
        <PublicRoute path='/:uid/confirmation' component={BookingConfirmation} />
        <PrivateRoute path='/:uid/bookings' component={MyBookings} />
        <Route path='/register' component={Register} exact={true} />
        <PrivateRoute path='/register/success' component={RegisterSuccess} />
        <PrivateRoute path='/:uid/settings' component={Settings} exact={true} />
        <PrivateRoute path='/:uid/settings/availability' component={SetAvailability} />
        <Redirect from='/redirect' to='/dashboard' />
      </Switch>
    </div>
  </Router>
)

export default AppRouter;
