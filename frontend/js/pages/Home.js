import PropTypes from 'prop-types';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import Auth from '../app/components/Auth/Auth';
import App from '../app/components/Repository/App';

const Home = ({ authenticated, store }) => {
  if (authenticated) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Redirect from="/login" to="/" />
            <Route component={App} exact path="/" />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }

  window.history.pushState({ urlPath: '/login' }, '', '/login');
  return (
    <Provider store={store}>
      <Auth />
    </Provider>
  );
};

Home.propTypes = {
  authenticated: PropTypes.bool,
  store: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    authenticated: state.auth.authenticated,
  };
};

export default connect(mapStateToProps)(Home);
