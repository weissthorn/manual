require('dotenv').config();
const config = require('../config');

const thinky = require('thinky')(config.api);
const r = thinky.r;
const type = thinky.type;

const User = thinky.createModel('users', {
  id: type.string(),
  name: type.string(),
  email: type.string(),
  password: type.string(),
  role: type.string().enum(['reader', 'editor', 'admin']),
  status: type.string().enum(['not active', 'active']).default('active'),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(),
});

const Manual = thinky.createModel('manuals', {
  id: type.string(),
  title: type.string(),
  description: type.string(),
  user: type.string(),
  slug: type.string(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(),
});

const Section = thinky.createModel('sections', {
  id: type.string(),
  title: type.string(),
  user: type.string(),
  slug: type.string(),
  manualId: type.string(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(),
});

const Content = thinky.createModel('contents', {
  id: type.string(),
  title: type.string(),
  content: type.string(),
  sectionId: type.string(),
  slug: type.string(),
  user: type.string(),
  createdAt: type.date().default(r.now),
  updatedAt: type.date().default(),
});

// Associations
Manual.belongsTo(User, 'author', 'user', 'id');
Manual.hasMany(Section, 'sections', 'id', 'manualId');
Section.hasMany(Content, 'contents', 'id', 'sectionId');

//User indices
User.ensureIndex('name');
User.ensureIndex('email');
User.ensureIndex('password');
User.ensureIndex('role');
User.ensureIndex('status');
User.ensureIndex('createdAt');
User.ensureIndex('updatedAt');

//Manual indices
Manual.ensureIndex('title');
Manual.ensureIndex('description');
Manual.ensureIndex('slug');
Manual.ensureIndex('user');
Manual.ensureIndex('createdAt');
Manual.ensureIndex('updatedAt');

//Section indices
Section.ensureIndex('title');
Section.ensureIndex('user');
Section.ensureIndex('slug');
Section.ensureIndex('manualId');
Section.ensureIndex('createdAt');
Section.ensureIndex('updatedAt');

//Content indices
Content.ensureIndex('title');
Content.ensureIndex('content');
Content.ensureIndex('sectionId');
Content.ensureIndex('slug');
Content.ensureIndex('user');
Content.ensureIndex('createdAt');
Content.ensureIndex('updatedAt');

module.exports = {
  r,
  User,
  Manual,
  Section,
  Content,
};
