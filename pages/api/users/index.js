import { r, User } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';
import moment from 'moment';

const totalCount = async () => {
  let val = await User.orderBy('createdAt')
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const index = async (req, res, next) => {
  await withAuth(req, res, next);

  let off = 0,
    page = Number(req.query.page),
    limit = Number(req.query.limit);

  if (page > 1) {
    off = limit * page;
    off = off - limit;
    limit = limit + off;
  }

  await totalCount().then(async (count) => {
    await User.orderBy(r.desc('createdAt'))
      .getJoin()
      .slice(off, limit)
      .then((data) => {
        data = data
          .slice()
          .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
          .map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            role: item.role,
            status: item.status,
            createdAt: item.createdAt,
          }));

        res.send({ success: true, data, count });
      })
      .catch((err) => logger(err));
  });
};

export default index;
