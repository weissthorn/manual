import React from 'react';
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
  const [name, setName] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [notify, setNotify] = React.useState();

  React.useEffect(() => {
    isConfigured();
  }, []);

  const isConfigured = async () => {
    const url = `api/users/config`;
    await fetch(url, {
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setLoading(false);
        } else {
          router.push('/login');
        }
      });
  };

  const handleName = (name) => {
    setName(name);
  };

  const handleEmail = (email) => {
    setEmail(email);
  };

  const handlePass = (password) => {
    setPassword(password);
  };

  const authenticate = async (data) => {
    setLoading(true);
    const url = `api/users/setup`;

    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.API_KEY },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setCookie(null, '_auth', JSON.stringify(res.data), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });
          setLoading(false);
          router.push('/manuals');
        } else {
          setNotify(res.error);
        }
      });
  };

  const login = (e) => {
    e.preventDefault();
    if (name.length < 3) {
      setNotify('Name is too short!');
    } else if (!email) {
      setNotify('Invalid email address!');
    } else if (password.length < 3) {
      setNotify('Password is too short!');
    } else {
      setNotify('');
      const data = { name, email, password, role: 'admin' };
      authenticate(data);
    }
  };

  return (
    <div className="show-fake-browser login-page">
      <title>Manual</title>

      <Container>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={12}>
            <div className="login center">
              <h3>Manual</h3>
              <p>Setup default account</p>
              <br />
              <Panel bordered style={{ padding: 20 }}>
                <Form fluid>
                  <p style={{ color: 'red', marginBottom: 15 }}>{notify}</p>

                  <FormGroup>
                    <FormControl
                      name="name"
                      type="email"
                      placeholder="Admin Name"
                      onChange={handleName}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      name="email"
                      type="email"
                      placeholder="Admin Email address"
                      onChange={handleEmail}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControl
                      name="password"
                      type="password"
                      placeholder="Admin Password"
                      onChange={handlePass}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <ButtonToolbar>
                      <Button size="lg" block color="blue" loading={loading} onClick={login}>
                        Get started &rarr;
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
