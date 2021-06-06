import { r, User } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const searchUsers = async (req, res) => {
  await withAuth(req, res);
  let query = req.query.query;

  User.orderBy(r.desc('createdAt'))
    .filter((profile) =>
      profile('name')
        .match('(?i)^' + query)
        .or(profile('email').match('(?i)^' + query))
        .or(profile('role').match('(?i)^' + query)),
    )
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export default searchUsers;
