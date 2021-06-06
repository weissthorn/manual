import React from "react"
import { Dropdown, Nav, Icon } from 'rsuite';
import Head from 'next/head';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export default function ManualHeader({ title, description }) {
  const [user, setUser] = React.useState({});

  React.useEffect(() => {

      const cookies = parseCookies()
  console.log({ cookies });
    let profile = window.localStorage.getItem('_aut');
    profile = profile ? JSON.parse(profile) : {};
    setUser(profile)
  }, [])

  const logout = () => {
    destroyCookie(null, "_auth");
    window.location.href = '/login';
  };


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
