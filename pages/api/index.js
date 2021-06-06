import { r, User } from '../../backend/model';

const totalCount = async () => {
  let val = await User.orderBy('createdAt')
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

const index = async (req, res) => {
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
        res.send({ success: true, data, count });
      })
      .catch((err) => console.log(err));
  });
};

export default index;
