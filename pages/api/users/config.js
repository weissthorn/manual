import { r, User } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const userConfig = async (req, res) => {
  await withAuth(req, res);
  await User.orderBy(r.desc('createdAt'))
    .then((data) => {
      if (data.length) {
        res.send({ success: false });
      } else {
        res.send({ success: true });
      }
    })
    .catch((err) => logger(err));
};

export default userConfig;
