import React from 'react';
import { Popover, User, Link } from '@geist-ui/core';
import { ChevronDown } from '@geist-ui/icons';
import NextLink from 'next/link';
import Head from 'next/head';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import useToken from './Token';

export default function MainHeader({ title, description }) {
  const router = useRouter();
  const user = useToken();

  React.useEffect(() => {
    user && user.id ? router.push('/login') : null;
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
          <NextLink href="/">
            <Link>Manual</Link>
          </NextLink>

          <div className="right">
            <Popover
              content={
                <>
                  {user.role === 'admin' ? (
                    <>
                      <Popover.Item>
                        <NextLink href="/admin">
                          <Link>Admin</Link>
                        </NextLink>
                      </Popover.Item>
                      <Popover.Item line />
                    </>
                  ) : (
                    ''
                  )}
                  <Popover.Item>
                    <NextLink href="/manuals">
                      <Link>Manuals</Link>
                    </NextLink>
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
