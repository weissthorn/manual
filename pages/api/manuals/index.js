import { r, Manual } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const getManuals = async (req, res) => {
  await withAuth(req, res);

  Manual.orderBy(r.desc('createdAt'))
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export default getManuals;
