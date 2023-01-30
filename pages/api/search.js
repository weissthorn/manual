import { r, Section } from '../../model';
import { withAuth } from '../../util';
import logger from '../../util/log';
import moment from 'moment';

const searchManual = async (req, res) => {
  await withAuth(req, res);
  let { manualId, query } = req.query;

  Section.orderBy(r.desc('createdAt'))
    .filter((page) =>
      page('manualId')
        .match(manualId)
        .and(page('title').match('(?i)' + query)),
    )
    .getJoin()
    .then((data) => {
      data = data.slice().sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix());

      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};


export const config = {
  api: {
    requestLimit: '50mb',
  },
};

export default searchManual;
