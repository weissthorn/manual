import React from 'react';
import { parseCookies } from 'nookies';

export default function Home() {
  React.useEffect(() => {
    let user = parseCookies();
    user =
      user && user._auth ? (window.location.href = '/manuals') : (window.location.href = '/login');
  }, []);

  return <></>;
}
