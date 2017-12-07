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

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path='/' component={Login} exact={true} />
        <PublicRoute path='/dashboard' component={Dashboard} />
        <PublicRoute path='/booking/:year/:month/:day' component={CreateBooking} />
        <Route path='/register' component={Register} exact={true}/>
        <PrivateRoute path='/register/success' component={RegisterSuccess} />
        <Redirect from='/redirect' to='/dashboard' />
      </Switch>
    </div>
  </Router>
)

export default AppRouter;
