'use strict';

import fs from 'fs';
import path from 'path';
import moment from 'moment';
import signale from 'signale';

const logger = (error) => {
  const date = moment().format('MMM D, YYYY @ hh:mm:ss A');
  const log = `${error}... => ${date} \n`;

  if (process.env.ENVIRONMENT === 'production') {
    fs.appendFile(path.resolve('log/error.log'), log, (err) => {
      if (err) signale.fatal(err);
    });
  } else {
    signale.fatal(log);
  }
};

export default logger;
