'use strict';
require('dotenv').config();

module.exports = {
  api: {
    host: process.env.DB_HOST,
    db: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  server: {
    port: process.env.PORT,
  },
};
