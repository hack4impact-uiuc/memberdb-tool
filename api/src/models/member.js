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
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  oauthID: { type: String, default: null, unique: true },
  email: { type: String, default: null, unique: true },
  phone: { type: String, default: null },
  netID: { type: String, default: null },
  UIN: { type: String, default: null },
  major: { type: String, default: null },
  birthdate: { type: Date, default: null },
  github: { type: String, default: null },
  snapchat: { type: String, default: null },
  instagram: { type: String, default: null },
  areDuesPaid: { type: Boolean, default: null },

  gradYear: { type: Number, default: null },
  gradSemester: {
    type: String,
    enum: Object.values(semesterEnum),
    default: null,
  },

  classStanding: {
    type: String,
    enum: Object.values(classStandingEnum),
    default: null,
  },

  generationYear: { type: Number, default: null },
  generationSemester: {
    type: String,
    enum: Object.values(semesterEnum),
    default: null,
  },

  location: {
    type: String,
    enum: Object.values(locationEnum),
    default: null,
  },

  role: {
    type: String,
    enum: Object.values(roleEnum),
    default: null,
  },

  level: {
    type: String,
    enum: Object.values(levelEnum),
    default: levelEnum.TBD,
  },

  status: {
    type: String,
    enum: Object.values(statusEnum),
    default: null,
  },
});

module.exports = mongoose.model('Member', Member);
module.exports.levelEnum = levelEnum;
module.exports.locationEnum = locationEnum;
module.exports.roleEnum = roleEnum;
module.exports.semesterEnum = semesterEnum;
module.exports.classStandingEnum = classStandingEnum;
module.exports.statusEnum = statusEnum;
