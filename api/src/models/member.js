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
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  oauthID: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true },
  phone: { type: String, required: false },
  netID: { type: String, required: false },
  UIN: { type: String, required: false },
  major: { type: String, required: false },
  birthdate: { type: Date, required: false },
  github: { type: String, required: false },
  snapchat: { type: String, required: false },
  instagram: { type: String, required: false },
  areDuesPaid: { type: Boolean, required: false },

  gradYear: { type: Number, required: false },
  gradSemester: {
    type: String,
    enum: Object.values(semesterEnum),
    required: false,
  },

  classStanding: {
    type: String,
    enum: Object.values(classStandingEnum),
    required: false,
  },

  generationYear: { type: Number, required: false },
  generationSemester: {
    type: String,
    enum: Object.values(semesterEnum),
    required: false,
  },

  location: {
    type: String,
    enum: Object.values(locationEnum),
    required: false,
  },

  role: {
    type: String,
    enum: Object.values(roleEnum),
    required: false,
  },

  level: {
    type: String,
    enum: Object.values(levelEnum),
    required: true,
  },

  status: {
    type: String,
    enum: Object.values(statusEnum),
    required: false,
  },
});

module.exports = mongoose.model('Member', Member);
module.exports.levelEnum = levelEnum;
