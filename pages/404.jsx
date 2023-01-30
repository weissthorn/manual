import React, { Component } from 'react';
import { Button, Link, Spacer } from '@geist-ui/core';

export default class NotFound extends Component {
  render() {
    return (
      <div className="show-fake-browser login-page">
        <title>Page not found - Manual</title>

        <div style={{ textAlign: 'center', padding: 10 }}>
          <Spacer h={10} />
          <h3>Oops ! Page you are looking for doesn't exists or deleted.</h3>
          <Spacer h={5} />
          <Button auto type="success">
            <Link href="/">&larr; Go back home</Link>
          </Button>
        </div>
      </div>
    );
  }
}
