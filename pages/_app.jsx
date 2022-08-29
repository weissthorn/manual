import 'rsuite/dist/styles/rsuite-default.css';
import '../styles/app.scss';

import React from 'react';
import App from 'next/app';

const noOverlayWorkaroundScript = `
  window.addEventListener('error', event => {
    event.stopImmediatePropagation()
  })

  window.addEventListener('unhandledrejection', event => {
    event.stopImmediatePropagation()
  })`;

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        {process.env.NODE_ENV !== 'production' && (
          <script dangerouslySetInnerHTML={{ __html: noOverlayWorkaroundScript }} />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Component {...pageProps} />
      </div>
    );
  }
}

export default CustomApp;
