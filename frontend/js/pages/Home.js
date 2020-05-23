import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { Switch, Redirect, Route, Router } from 'react-router-dom';

import Auth from '../app/components/Auth/Auth';
import App from '../app/components/Repository/App';
import RepoDetail from '../app/components/Repository/RepoDetail';

const Home = ({ authenticated, store }) => {
  const history = createBrowserHistory();
  if (authenticated) {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Redirect from="/login" to="/" />
            <Route component={App} exact path="/" />
            <Route component={RepoDetail} path="/repository/:id" />
          </Switch>
        </Router>
      </Provider>
    );
  }
  if (history.location.pathname === '/api/callback/') {
    window.history.pushState({ urlPath: '/login' }, '', '/login');
  }
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
