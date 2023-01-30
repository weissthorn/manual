import { User } from '../../../model';
import { withAuth } from '../../../util';
import bcrypt from 'bcryptjs';

const userLogin = async (req, res, next) => {
  await withAuth(req, res, next);

  const user = req.body;
  await User.filter({ email: user.email })
    .then((data) => {
      bcrypt.compare(user.password, data[0].password).then(function (result) {
        if (result && data[0].status === 'active') {
          delete data[0].password;
          res.send({ success: true, data: data[0] });
        } else if (result && data[0].status !== 'active') {
          res.send({
            success: false,
            error: 'This account is not active. Please contact admin.',
          });
        } else {
          res.send({
            success: false,
            error: 'Email or password is incorrect!',
          });
        }
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        error: 'Email or password is incorrect!',
      });
    });
};

export default userLogin;
