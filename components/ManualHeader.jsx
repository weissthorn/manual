import { useEffect } from 'react';
import { Popover, User, Link } from '@geist-ui/core';
import { ChevronDown } from '@geist-ui/icons';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import useToken from './Token';

export default function ManualHeader({ title, description }) {
  const router = useRouter();
  const user = useToken();

  useEffect(() => {
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
              <div>
                {user.role === 'admin' ? (
                  <div>
                    <Popover.Item>
                      <Link href="/admin">Admin</Link>
                    </Popover.Item>
                    <Popover.Item line />
                  </div>
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
              </div>
            }
          >
            <div className="menu">
              <User src="/avatar.png" name={getFirstName(user?.name)} />{' '}
              <span className="fix-caret">
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
