import { Manual } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const updateManual = async (req, res) => {
  await withAuth(req, res);

  Manual.get(req.body.id)
    .update(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export default updateManual;
