import { r, Manual, Section, Content } from '../../model';
import { withAuth } from '../../util';
import logger from '../../util/log';
import moment from 'moment';

const searchManual = async (req, res) => {
  await withAuth(req, res);
  let { query } = req.query;

  Content.orderBy(r.desc('createdAt'))
    .filter((page) =>
      page('title')
        .match('(?i)' + query)
        .or(page('content').match('(?i)' + query)),
    )
    .getJoin()
    .then((data) => {
      data = data.slice().sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix());

      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export default searchManual;
