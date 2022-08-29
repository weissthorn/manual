import React from 'react';
import { Container, FlexboxGrid, Button, Loader } from 'rsuite';
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

      <Container>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item colspan={12}>
            <center className="login">
              <div style={{ display: loading ? 'block' : 'none' }}>
                <Loader size="lg" />
              </div>
              <div style={{ display: loading ? 'none' : 'block' }}>
                <h3 className="center">Manual</h3>

                <p>You are almost there! Set up an admin account</p>
                <span className="space" />
                <Button appearance="primary" href="/setup">
                  Yes! Let's do it
                </Button>
              </div>
            </center>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Container>
    </div>
  );
}
