import { Section } from '../../../model';
import { withAuth } from '../../../util';
import logger from '../../../util/log';

const updateSection = async (req, res) => {
  await withAuth(req, res);

  Section.get(req.body.id)
    .update(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export const config = {
  api: {
    requestLimit: '50mb',
  },
};


export default updateSection;
