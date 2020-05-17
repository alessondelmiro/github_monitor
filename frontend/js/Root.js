import PropTypes from 'prop-types';
import React from 'react';
import { hot } from 'react-hot-loader/root';

import Home from './pages/Home';
import SentryBoundary from './utils/SentryBoundary';

const Root = ({ store }) => (
  <SentryBoundary>
    <Home store={store} />
  </SentryBoundary>
);

Root.propTypes = {
  store: PropTypes.object,
};

export default hot(Root);
