import { Content } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const updateContent = async (req, res) => {
  await withAuth(req, res);

  Content.get(req.body.id)
    .update(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export default updateContent;
