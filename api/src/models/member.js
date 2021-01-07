/**
 * Schema representing a H4I member
 */
const mongoose = require('mongoose');

const levelEnum = {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  LEAD: 'LEAD',
  MEMBER: 'MEMBER',
  TBD: 'TBD',
};

const locationEnum = {
  REMOTE: 'REMOTE',
  CAMPUS: 'CAMPUS',
  TBD: 'TBD',
};

const roleEnum = {
  CO_DIRECTOR: 'CO_DIRECTOR',
  COMMUNITY_DIRECTOR: 'COMMUNITY_DIRECTOR',
  EXTERNAL_DIRECTOR: 'EXTERNAL_DIRECTOR',
  ACADEMY_LEAD: 'ACADEMY_LEAD',
  TECH_LEAD: 'TECH_LEAD',
  PR_LEAD: 'PR_LEAD',
  PRODUCT_MANAGER: 'PRODUCT_MANAGER',
  PRODUCT_DESIGNER: 'PRODUCT_DESIGNER',
  DEVELOPER: 'DEVELOPER',
  ACADEMY_MEMBER: 'ACADEMY_MEMBER',
};

const statusEnum = {
  ACTIVE: 'ACTIVE',
  HIATUS: 'HIATUS',
  RETIRED: 'RETIRED',
  TBD: 'TBD',
};

const semesterEnum = {
  FALL: 'FALL',
  SPRING: 'SPRING',
};

const classStandingEnum = {
  FRESHMAN: 'FRESHMAN',
  SOPHOMORE: 'SOPHOMORE',
  JUNIOR: 'JUNIOR',
  SPRING_SENIOR: 'SPRING_SENIOR',
  FALL_SENIOR: 'FALL_SENIOR',
  MASTERS: 'MASTERS',
  PHD: 'PHD',
};

const Member = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  oauthID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  netID: { type: String, required: true },
  UIN: { type: String, required: true },
  major: { type: String, required: true },
  birthdate: { type: Date, required: true },
  github: { type: String, required: false },
  snapchat: { type: String, required: false },
  instagram: { type: String, required: false },
  areDuesPaid: { type: Boolean, required: true },

  gradYear: { type: Number, required: true },
  gradSemester: {
    type: String,
    enum: Object.values(semesterEnum),
    required: true,
  },

  classStanding: {
    type: String,
    enum: Object.values(classStandingEnum),
    required: true,
  },

  generationYear: { type: Number, required: true },
  generationSemester: {
    type: String,
    enum: Object.values(semesterEnum),
    required: true,
  },

  location: {
    type: String,
    enum: Object.values(locationEnum),
    required: true,
  },

  role: {
    type: String,
    enum: Object.values(roleEnum),
    required: true,
  },

  level: {
    type: String,
    enum: Object.values(levelEnum),
    required: true,
  },

  status: {
    type: String,
    enum: Object.values(statusEnum),
    required: true,
  },
});

module.exports = mongoose.model('Member', Member);
module.exports.levelEnum = levelEnum;
