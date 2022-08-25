import { Content } from '../../../model';
import { withAuth } from '../../../util';

const getContent = async (req, res, next) => {
  await withAuth(req, res, next);

  const { slug } = req.query;
  Content.filter({ slug })
    .getJoin()
    .then((data) => {
      if (data.length) {
        res.send({ success: true, data: data[0] });
      } else {
        res.send({ success: false, error: 'Unable to get content.' });
      }
    })
    .catch((err) => logger(err));
};

export default getContent;
