import React, { Component } from 'react';
import { Button } from 'rsuite';

export default class NotFound extends Component {
  render() {
    return (
      <div className="show-fake-browser login-page">
        <title>Unauthorized access - Manual</title>

        <div style={{ textAlign: 'center', padding: 10 }}>
          <br />
          <br />
          <br />
          <br />
          <h3>Oops ! You are not authorized to access this page.</h3>
          <br />
          <br />
          <br />
          <br />
          <Button size="lg" color="blue" href="/">
            &larr; Go back home
          </Button>
        </div>
      </div>
    );
  }
}
