import React from 'react';
import { Button, Loading, Link, Spacer } from '@geist-ui/core';
import { useRouter } from 'next/router';

export default function Config() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

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

  return (
    <div className="show-fake-browser login-page">
      <title>Manual</title>
      <Spacer h={7} />
      <center className="login">
        <div style={{ display: loading ? 'block' : 'none' }}>
          <Loading>Checking setup status</Loading>
        </div>
        <div style={{ display: loading ? 'none' : 'block' }}>
          <h3 className="center">{process.env.NEXT_PUBLIC_SITE_NAME}</h3>

          <p>You are almost there! Set up an admin account</p>
          <span className="space" />
          <Button type="secondary-light">
            <Link href="/setup">Yes! Let's do it</Link>
          </Button>
        </div>
      </center>
    </div>
  );
}
