import { Manual } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const getManual = async (req, res, next) => {
  await withAuth(req, res, next);

  const { slug } = req.query;
  await Manual.filter({ slug })
    .getJoin()
    .then((data) => {
      if (data.length) {
        res.send({ success: true, data: data[0] });
      } else {
        res.send({ success: false, error: 'Unable to get manual.' });
      }
    })
    .catch((err) => logger(err));
};

export const config = {
  api: {
    requestLimit: '50mb',
  },
};

export default getManual;
