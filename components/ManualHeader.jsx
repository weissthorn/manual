import React from 'react';
import { Popover, User, Link } from '@geist-ui/core';
import { ChevronDown } from '@geist-ui/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';

export default function ManualHeader({ title, description }) {
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

  const getFirstName = (name) => {
    name = name?.split(' ');
    name = name?.length ? name[0] : '';
    return name;
  };

  return (
    <div className="user-profile">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      {user ? (
        <div>
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
              <span className="fix-caretss">
                <ChevronDown size={16} />
              </span>
            </div>
          </Popover>
        </div>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
}
