import React from 'react'
import createHistory from 'history/createBrowserHistory'
import { Router, Route, Switch } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import Landing from '../components/Landing'
import Dashboard from '../components/Dashboard'
import Register from '../components/Register'
import RegisterSuccess from '../components/RegisterSuccess'
import Login from '../components/LoginPage'
import Settings from '../components/Settings'
import MyBookings from '../components/MyBookings'
import ServiceSelectPage from '../components/ServiceSelectPage'
import BookingConfirmation from '../components/BookingConfirmation'
import SetAvailability from '../components/SetAvailability'
import SetAvailabilitySuccess from '../components/SetAvailabilitySuccess'
import CancelConfirmation from '../components/CancelConfirmation'
import PublicCancel from '../components/PublicCancel'
import UpdateUserForm from  '../components/UpdateUserForm'
import ChangeConfirm from '../components/ChangeConfirm'


export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path='/' component={Landing} exact={true} />
        <Route path='/login' component={Login} />
        <PublicRoute path='/:uid/dashboard' component={Dashboard} exact={true} />
        <PublicRoute path='/:uid/:year/:month/:day/selectservice' component={ServiceSelectPage} />
        <PublicRoute path='/:uid/confirmation' component={BookingConfirmation} />
        <PrivateRoute path='/:uid/bookings' component={MyBookings} exact={true} />
        <PrivateRoute path='/:uid/bookings/cancelconfirmation' component={CancelConfirmation} />
        <PublicRoute path='/:uid/bookings/:date/:bookingID/cancel' component={PublicCancel} />
        <Route path='/register' component={Register} exact={true} />
        <PrivateRoute path='/register/success' component={RegisterSuccess} />
        <PrivateRoute path='/:uid/settings' component={Settings} exact={true} />
        <PrivateRoute path='/:uid/settings/availability' component={SetAvailability} exact={true} />
        <PrivateRoute path='/:uid/settings/availability/success' component={SetAvailabilitySuccess} />
        <PrivateRoute path='/:uid/settings/changepassword' component={UpdateUserForm} />
        <PrivateRoute path='/:uid/settings/changeusername' component={UpdateUserForm} />
        <PrivateRoute path='/:uid/settings/changeconfirm' component={ChangeConfirm} />
        <Redirect from='/redirect' to='/' />
      </Switch>
    </div>
  </Router>
)

export default AppRouter;
