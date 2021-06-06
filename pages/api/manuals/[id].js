import { Manual } from '../../../model';
import { withAuth } from '../../../util';

const getManual = async (req, res, next) => {
  await withAuth(req, res, next);

  const slug = req.params.slug;
  Manual.filter({ slug })
    .getJoin()
    .then((data) => {
      if (data.length === 1) {
        res.send({ success: true, data: data[0] });
      } else {
        res.send({ success: false, error: 'Unable to get manual.' });
      }
    })
    .catch((err) => logger(err));
};

export default getManual;
