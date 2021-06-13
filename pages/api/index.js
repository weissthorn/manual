import { withAuth } from '../../util';

const index = async (req, res) => {
  await withAuth(req, res);
  res.send({ success: true, data: 'Manual API' });
};

export default index;
