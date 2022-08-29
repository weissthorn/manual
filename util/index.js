const slug = () => {
  return Math.random().toString(32).substring(2, 7) + Math.random().toString(32).substring(2, 7);
};

const code = () => {
  let code = Math.random() * (1000000000 - 10000) + 10000;
  code = Math.round(code);
  return code;
};

const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const percentage = (current, total) => {
  let val = current / total;
  val = val.toFixed(1);
  val = val * 100;
  return val;
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const withAuth = async (req, res) => {
  var allowlist = process.env.NEXT_PUBLIC_CLIENT_ORIGINS.split(',');

  if (allowlist.indexOf(req.headers.host) !== -1) {
    const apikey = req.headers.apikey;

    if (apikey !== process.env.NEXT_PUBLIC_API_KEY) {
      res.status(400).send({ success: false, error: 'Invalid API key' });
      res.end();
    }
  } else {
    res.status(400).send({ success: false, error: 'Unathorized access' });
    res.end();
  }
};

export { slug, code, guid, percentage, asyncForEach, withAuth };
