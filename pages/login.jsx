import React, { Component } from 'react';
import {
  Container,
  Form,
  FlexboxGrid,
  Panel,
  FormGroup,
  FormControl,
  Button,
  ButtonToolbar,
} from 'rsuite';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [notify, setNotify] = React.useState();

  const handleEmail = (email) => {
    setEmail(email);
  };

  const handlePass = (password) => {
    setPassword(password);
  };

  const authenticate = async (data) => {
    console.log(process.env);
    setLoading(true);
    const url = `/api/users/login`;

    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setCookie(null, '_auth', JSON.stringify(res.data), {
            maxAge: 2 * 60 * 60, // 2 hours
            path: '/',
          });
          setLoading(false);
          router.push('/manuals');
        } else {
          setNotify(res.error);
          setLoading(false);
        }
      });
  };

  const login = () => {
    if (!email) {
      setNotify('Invalid email address!');
    } else if (password.length < 3) {
      setNotify('Password is too short!');
    } else {
      setNotify('');
      const data = { email, password };
      authenticate(data);
    }
  };

  return (
    <div className="show-fake-browser login-page">
      <title>Login - Manual</title>

      <Container>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={12}>
            <div className="login center">
              <h3>Manual</h3>
              <p>Login into your account</p>
              <br />
              <Panel bordered style={{ padding: 20 }}>
                <Form fluid>
                  <p style={{ color: 'red', marginBottom: 15 }}>{notify}</p>

                  <FormGroup>
                    <FormControl
                      name="email"
                      type="email"
                      placeholder="Email address"
                      onChange={handleEmail}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      name="password"
                      type="password"
                      placeholder="Password"
                      onChange={handlePass}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <ButtonToolbar>
                      <Button size="lg" block color="blue" loading={loading} onClick={login}>
                        Sign in
                      </Button>
                    </ButtonToolbar>
                  </FormGroup>
                </Form>
              </Panel>
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Container>
    </div>
  );
}
