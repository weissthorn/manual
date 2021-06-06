import React, { Component } from 'react';
import { Container, Content } from 'rsuite';
import Header from '../components/Header';

export default class About extends Component {
  render() {
    return (
      <div className="show-fake-browser navbar-page">
        <Helmet>
          <title>About us</title>
        </Helmet>
        <Container>
          <Header />

          <Content className="container">
            <br />
            <br />
            <h3>About Us</h3>
            <div>
              <p>
                Used by millions, Akismet is quite possibly the best way in the world to protect
                your blog from spam. It keeps your site protected even while you sleep. To get
                started: activate the Akismet plugin and then go to your Akismet Settings page to
                set up your API key. Used by millions, Akismet is quite possibly the best way in the
                world to protect your blog from spam. It keeps your site protected even while you
                sleep. To get started: activate the Akismet plugin and then go to your Akismet
                Settings page to set up your API key. Used by millions, Akismet is quite possibly
                the best way in the world to protect your blog from spam. It keeps your site
                protected even while you sleep. To get started: activate the Akismet plugin and then
                go to your Akismet Settings page to set up your API key.
              </p>
              <p>
                Used by millions, Akismet is quite possibly the best way in the world to protect
                your blog from spam. It keeps your site protected even while you sleep. To get
                started: activate the Akismet plugin and then go to your Akismet Settings page to
                set up your API key. Used by millions, Akismet is quite possibly the best way in the
                world to protect your blog from spam. It keeps your site protected even while you
                sleep. To get started: activate the Akismet plugin and then go to your Akismet
                Settings page to set up your API key. Used by millions, Akismet is quite possibly
                the best way in the world to protect your blog from spam. It keeps your site
                protected even while you sleep. To get started: activate the Akismet plugin and then
                go to your Akismet Settings page to set up your API key.
              </p>
            </div>
          </Content>
        </Container>
      </div>
    );
  }
}
