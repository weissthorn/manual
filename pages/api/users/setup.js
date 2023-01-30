import bcrypt from 'bcryptjs';
import { User } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const userExist = async (id) => {
  let val = await User.filter({ email: id })
    .then((data) => data)
    .catch((err) => logger(err));
  return val;
};

const newUser = async (req, res) => {
  await withAuth(req, res);
  let email = req.body.email;
  await bcrypt.hash(req.body.password, 10, function (err, hash) {
    req.body.password = hash;
    userExist(email)
      .then((user) => {
        if (!user[0]) {
          let new_user = new User(req.body);
          new_user
            .save()
            .then((result) => {
              //Send email
              let name = result.name.split(' ');
              name = name[0];
              // signup(result.email, name);

              res.send({ success: true, data: result });
            })
            .catch((err) => logger(err));
        } else {
          res.status(400).send({
            success: false,
            error: 'User already exists in our records.',
          });
        }
      })
      .catch((err) => logger(err));
  });
};

export default newUser;
