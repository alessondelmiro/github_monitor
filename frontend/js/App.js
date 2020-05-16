import PropTypes from 'prop-types';
import React from 'react';
import { hot } from 'react-hot-loader/root';

import Home from './pages/Home';
import SentryBoundary from './utils/SentryBoundary';

const App = ({ store }) => (
  <SentryBoundary>
    <Home store={store} />
  </SentryBoundary>
);

App.propTypes = {
  store: PropTypes.object,
};

export default hot(App);
