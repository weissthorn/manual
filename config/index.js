'use strict';

module.exports = {
  api: {
    host: process.env.NEXT_PUBLIC_DB_HOST,
    db: process.env.NEXT_PUBLIC_DB_NAME,
    port: process.env.NEXT_PUBLIC_DB_PORT,
  },
  server: {
    port: process.env.NEXT_PUBLIC_PORT,
  },
};
