"use strict";

const slugify = require("slugify");
const { Section } = require("../model");
const logger = require("../util/log");

const newSection = (req, res) => {
  console.log(req.body);
  req.body.slug = slugify(req.body.title, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: "vi", // language code of the locale to use
  });

  let content = new Section(req.body);
  content
    .save()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const updateSection = (req, res) => {
  Section.get(req.body.id)
    .update(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getSections = (req, res) => {
  Section.getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getSection = (req, res) => {
  const slug = req.params.slug;
  Section.filter({ slug })
    .getJoin()
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

module.exports = { newSection, updateSection, getSections, getSection };
