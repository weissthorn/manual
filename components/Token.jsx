import React, { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';

export default function useToken() {
  const cookie = parseCookies();
  const [token, setToken] = useState({
    id: '',
    name: '',
  });

  useEffect(() => {
    let user = cookie;
    user = user && user && user._auth ? JSON.parse(user._auth) : null;
    user ? setToken(user) : null;
  }, []);

  return token;
}
