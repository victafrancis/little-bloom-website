import React from 'react';
import * as Sentry from '@sentry/react';
import './index.css';
import { render } from 'react-dom';
import { App } from './App';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  enableLogs: true,
});

render(<App />, document.getElementById('root'));
