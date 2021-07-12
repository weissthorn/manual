import React from 'react';
import { Header, Navbar, Dropdown, Nav, Icon } from 'rsuite';
import Head from 'next/head';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/router';

export default function MainHeader({ title, description }) {
  const router = useRouter();
  const cookie = parseCookies();

  React.useEffect(() => {
    !cookie._auth ? router.push('/login') : null;
  }, []);

  const logout = () => {
    destroyCookie(null, '_auth');
    router.push('/login');
  };

  const isLoggedIn = () => {
    let user = cookie;
    user = user && user._auth ? JSON.parse(user._auth) : {};
    return user;
  };

  const user = isLoggedIn();
  return (
    <Header>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <Navbar appearance="subtle">
        <div className="container">
          <Navbar.Header>
            <a href="/" className="navbar-brand logo">
              Manual
            </a>
          </Navbar.Header>
          <Navbar.Body>
            <Nav pullRight>
              {user ? (
                <span>
                  <Dropdown placement="bottomEnd" title={user.name} icon={<Icon icon="user" />}>
                    {user.role === 'admin' ? (
                      <Dropdown.Item href="/admin">Admin</Dropdown.Item>
                    ) : (
                      ''
                    )}
                    <Dropdown.Item href="/manuals">Manuals</Dropdown.Item>
                    <Dropdown.Item divider />
                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                  </Dropdown>
                </span>
              ) : (
                <span>
                  <Nav.Item href="/login">Login</Nav.Item>
                </span>
              )}
            </Nav>
          </Navbar.Body>
        </div>
      </Navbar>
    </Header>
  );
}
