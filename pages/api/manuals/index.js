import { r, Manual } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';
import moment from 'moment';

const getManuals = async (req, res) => {
  await withAuth(req, res);

  await Manual.orderBy(r.desc('createdAt'))
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
export default getManuals;
