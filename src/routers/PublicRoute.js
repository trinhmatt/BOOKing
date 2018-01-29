import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PublicRoute = ({isAuth, component: Component, ...rest}) => (
  <Route {...rest} component={ (props) => (
      <div>
        {isAuth ? <Header /> : ''}
        <Component {...props}/>
        <Footer />
      </div>
    )
  }/>
);

const mapStateToProps = (state) => ({
  isAuth: !!state.auth.uid
});

export default connect(mapStateToProps)(PublicRoute);
