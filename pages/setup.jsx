import React from 'react';

import { Input, Button, Card, Spacer } from '@geist-ui/core';
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
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
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
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
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

  const login = async () => {
    if (!name || name.length < 3) {
      setNotify('Name is too short! Minimum  3 characters.');
    } else if (!email) {
      setNotify('Invalid email address!');
    } else if (!password || password.length < 6) {
      setNotify('Password is too short! Minimum  6 characters.');
    } else {
      setNotify('');
      const data = { name, email, password, role: 'admin' };
      await authenticate(data);
    }
  };

  return (
    <div className="show-fake-browser login-page">
      <title>Manual</title>
      <div className="form center">
        <Spacer h={7} />
        <h3>{process.env.NEXT_PUBLIC_SITE_NAME}</h3>
        <p>Setup Admin account</p>
        <Spacer />
        <Card shadow>
          <div className="bordered">
            <p style={{ color: 'red', marginBottom: 15 }}>{notify}</p>
            <Input
              width={'100%'}
              name="name"
              placeholder="Admin Name"
              onChange={(e) => handleName(e.target.value)}
              required
            />
            <Spacer />
            <Input
              width={'100%'}
              name="email"
              htmlType="email"
              placeholder="Email address"
              onChange={(e) => handleEmail(e.target.value)}
              required
            />
            <Spacer />
            <Input.Password
              width={'100%'}
              name="password"
              htmlType="password"
              placeholder="Password"
              onChange={(e) => handlePass(e.target.value)}
              required
            />
            <Spacer />
            <Button width={'100%'} type="secondary-light" loading={loading} onClick={login}>
              Get started
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
