"use strict";

const { newManual, updateManual, getManuals, getManual } = require("./manual");
const {
  newSection,
  updateSection,
  getSections,
  getSection,
} = require("./section");

const {
  newContent,
  updateContent,
  getContents,
  getContent,
} = require("./content");

const {
  newUser,
  updateUser,
  getUsers,
  searchUsers,
  getUser,
  userLogin,
} = require("./user");

module.exports = {
  newManual,
  updateManual,
  getManuals,
  getManual,
  newSection,
  updateSection,
  getSections,
  getSection,
  newContent,
  updateContent,
  getContents,
  getContent,
  newUser,
  updateUser,
  getUsers,
  searchUsers,
  getUser,
  userLogin,
};
