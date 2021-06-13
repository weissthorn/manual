import slugify from 'slugify';
import { Content } from '../../../model';
import { withAuth } from '../../../util';
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
  let manual = new Content(req.body);
  manual
    .save()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

export default newContent;
