import bcrypt from 'bcryptjs';
import { User } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const updateUser = async (req, res) => {
  await withAuth(req, res);

  if (req.body.password) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      req.body.password = hash;
      User.get(req.body.id)
        .update(req.body)
        .then((data) => {
          data.success = true;
          res.send(data);
        })
        .catch((err) => logger(err));
    });
  } else {
    User.get(req.body.id)
      .update(req.body)
      .then((data) => {
        data.success = true;
        res.send(data);
      })
      .catch((err) => logger(err));
  }
};

export default updateUser;
