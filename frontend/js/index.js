// import pages
import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';

import './bootstrap-includes';
import '../sass/style.scss';

import App from './App';
import store from './redux';

Sentry.init({
  dsn: window.SENTRY_DSN,
  release: window.COMMIT_SHA,
});

ReactDOM.render(<App store={store} />, document.getElementById('react-app'));
