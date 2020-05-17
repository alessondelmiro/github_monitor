// import pages
import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';

import './bootstrap-includes';
import '../sass/style.scss';

import store from './redux';
import Root from './Root';

Sentry.init({
  dsn: window.SENTRY_DSN,
  release: window.COMMIT_SHA,
});

ReactDOM.render(<Root store={store} />, document.getElementById('react-app'));
