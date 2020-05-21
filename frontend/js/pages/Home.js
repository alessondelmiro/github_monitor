import PropTypes from 'prop-types';
import React from 'react';
import { connect, Provider } from 'react-redux';
import { HashRouter, Switch, Redirect, Route } from 'react-router-dom';

import Auth from '../app/components/Auth/Auth';
import App from '../app/components/Repository/App';
import RepoDetail from '../app/components/Repository/RepoDetail';

const Home = ({ authenticated, store }) => {
  if (authenticated) {
    // window.location.replace('/#/');
    // window.history.pushState({ urlPath: '/#/' }, '/#/', '/#/');
    return (
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <Redirect from="/login" to="/" />
            <Route component={App} exact path="/" />
            <Route component={RepoDetail} path="/repositories/:id" />
          </Switch>
        </HashRouter>
      </Provider>
    );
  }

  // window.history.pushState({ urlPath: '/#/login' }, '/#', '/#/login');
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
