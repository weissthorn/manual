import { Section } from '../../../model';
import { withAuth } from '../../../util';

const getSection = async (req, res, next) => {
  await withAuth(req, res, next);

  const { slug } = req.query;
  Section.filter({ slug })
    .getJoin()
    .then((data) => {
      if (data.length === 1) {
        res.send({ success: true, data: data[0] });
      } else {
        res.send({ success: false, error: 'Unable to get content.' });
      }
    })
    .catch((err) => logger(err));
};

export default getSection;
