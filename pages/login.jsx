import { useState } from 'react';
import { Input, Button, Card, Spacer } from '@geist-ui/core';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [notify, setNotify] = useState();

  const handleEmail = (email) => {
    setEmail(email);
  };

  const handlePass = (password) => {
    setPassword(password);
  };

  const authenticate = async (data) => {
    setLoading(true);
    const url = `/api/users/login`;

    await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: process.env.NEXT_PUBLIC_API_KEY },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setCookie(null, '_auth', JSON.stringify(res.data), {
            maxAge: 6 * 60 * 60, // 2 hours
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
      <Spacer h={10} />
      <div className="form center">
        <h3>{process.env.NEXT_PUBLIC_SITE_NAME}</h3>
        <p>Login into your account</p>
        <Spacer />
        <Card shadow>
          <div className="bordered">
            <p style={{ color: 'red', marginBottom: 15 }}>{notify}</p>

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
              Sign in
            </Button>
          </div>
        </Card>
        <Spacer h={3} />
      </div>
    </div>
  );
};

export default Login;
