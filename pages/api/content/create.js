import slugify from 'slugify';
import { Content } from '../../../model';
import { withAuth, slug } from '../../../util';
import logger from '../../../util/log';

const newContent = async (req, res) => {
  await withAuth(req, res);

  req.body.slug = slugify(req.body.title, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'vi', // language code of the locale to use
  });
  req.body.slug = req.body.slug + '-' + slug();

  let content = new Content(req.body);
  content
    .save()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default newContent;
