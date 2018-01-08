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
import CreateBooking from '../components/CreateBooking'
import Settings from '../components/Settings'

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path='/' component={Login} exact={true} />
        <PublicRoute path='/:uid/dashboard' component={Dashboard} exact={true}/>
        <PublicRoute path='/:uid/booking/:year/:month/:day' component={CreateBooking} />
        <Route path='/register' component={Register} exact={true}/>
        <PrivateRoute path='/register/success' component={RegisterSuccess} />
        <PrivateRoute path='/settings' component={Settings} />
        <Redirect from='/redirect' to='/dashboard' />
      </Switch>
    </div>
  </Router>
)

export default AppRouter;
