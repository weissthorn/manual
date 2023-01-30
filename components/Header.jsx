import React from 'react';
import { Popover, User, Link } from '@geist-ui/core';
import { ChevronDown } from '@geist-ui/icons';

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

  const getFirstName = (name) => {
    name = name?.split(' ');
    name = name?.length ? name[0] : '';
    return name;
  };

  const isLoggedIn = () => {
    let user = cookie;
    user = user && user._auth ? JSON.parse(user._auth) : {};
    return user;
  };

  const user = isLoggedIn();
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className="navbar">
        <div className="inner">
          <Link href="/">Manual</Link>

          <div className="right">
            <Popover
              content={
                <>
                  {user.role === 'admin' ? (
                    <>
                      <Popover.Item>
                        <Link href="/admin">Admin</Link>
                      </Popover.Item>
                      <Popover.Item line />
                    </>
                  ) : (
                    ''
                  )}
                  <Popover.Item>
                    <Link href="/manuals">Manuals</Link>
                  </Popover.Item>
                  <Popover.Item line />
                  <Popover.Item onClick={logout}>
                    <Link href="#" icon>
                      Logout
                    </Link>
                  </Popover.Item>
                </>
              }
            >
              <div className="menu">
                <User src="/avatar.png" name={getFirstName(user?.name)} />{' '}
                <span className="icon">
                  <ChevronDown size={16} />
                </span>
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
