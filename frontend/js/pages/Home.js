import PropTypes from 'prop-types';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { Switch, Redirect, Route, BrowserRouter } from 'react-router-dom';

import Auth from '../app/components/Auth/Auth';
import App from '../app/components/Repository/App';
import RepoDetail from '../app/components/Repository/RepoDetail';

const Home = ({ authenticated, store }) => {
  if (authenticated) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Redirect from="/login" to="/" />
            <Route component={App} exact path="/" />
            <Route component={RepoDetail} path="/repository/:id" />
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
