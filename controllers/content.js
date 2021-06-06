"use strict";
const slugify = require("slugify");
const { Content } = require("../model");
const logger = require("../util/log");

const newContent = (req, res) => {
  req.body.slug = slugify(req.body.title, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
  });
  let content = new Content(req.body);
  content
    .save()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const updateContent = (req, res) => {
  Content.get(req.body.id)
    .update(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getContents = (req, res) => {
  Content.getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getContent = (req, res) => {
  const slug = req.params.slug;
  Content.filter({ slug })
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

module.exports = { newContent, updateContent, getContents, getContent };
