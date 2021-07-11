import React from 'react';
import { Dropdown, Nav, Icon } from 'rsuite';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';


export default function ManualHeader({ title, description }) {
  const router = useRouter();

  React.useEffect(() => {
     const cookie = parseCookies();
    !cookie._auth ? router.push('/login') : null;
  }, []);

  const logout = () => {
    destroyCookie(null, '_auth');
    router.push('/login');
  };

  const isLoggedIn = () => {
    let user = parseCookies();
    user = user && user._auth ? JSON.parse(user._auth) : {};
    return user;
  };

  const user = isLoggedIn();

  return (
    <span className="user">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      {user ? (
        <span>
          <Dropdown placement="bottomEnd" title={user.name} icon={<Icon icon="user" />}>
            {user.role === 'admin' ? <Dropdown.Item href="/admin">Admin</Dropdown.Item> : ''}
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
    </span>
  );
}
