import 'rsuite/dist/styles/rsuite-default.css';
import '../styles/app.scss';

import React from 'react';
import App from 'next/app';

class CustomApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Component {...pageProps} />
      </div>
    );
  }
}

export default CustomApp;
