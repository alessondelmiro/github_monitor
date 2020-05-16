import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';

import Auth from '../app/containers/Auth/Auth';

const Home = ({ authenticated, store }) => {
  if (authenticated) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Redirect from="/login" to="/" />
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

export default Home;
