/**
 * Schema representing a H4I member
 */
const mongoose = require('mongoose');

const levelEnum = {
  ADMIN: 'ADMIN',
  CHAPTER_DIRECTOR: 'CHAPTER DIRECTOR',
  MEMBER: 'MEMBER',
};

const statusEnum = {
  ACTIVE: 'ACTIVE',
  HIATUS: 'HIATUS',
  RETIRED: 'RETIRED',
};

const roleEnum = {
  CO_DIRECTOR: 'CO_DIRECTOR',
  COMMUNITY_DIRECTOR: 'COMMUNITY_DIRECTOR',
  EXTERNAL_DIRECTOR: 'EXTERNAL_DIRECTOR',
  TECH_DIRECTOR: 'TECH_DIRECTOR',
  ACADEMY_LEAD: 'ACADEMY_LEAD',
  TECH_LEAD: 'TECH_LEAD',
  PR_LEAD: 'PRODUCT_RESEARCH_LEAD',
  PRODUCT_MANAGER: 'PRODUCT_MANAGER',
  PRODUCT_DESIGNER: 'PRODUCT_DESIGNER',
  DEVELOPER: 'SOFTWARE_DEVELOPER',
  ACADEMY_MEMBER: 'ACADEMY_MEMBER',
  DIRECTOR_OF_FINANCE: 'DIRECTOR_OF_FINANCE',
  DIRECTOR_OF_OPERATIONS: 'DIRECTOR_OF_OPERATIONS',
};

const chapterEnum = {
  UPENN: 'University of Pennsylvania',
  UIUC: 'University of Illinois at Urbana-Champaign',
  GEORGIA_TECH: 'Bits of Good - Georgia Tech',
  CORNELL_UNIVERSITY: 'Cornell University',
  BOSTON_UNIVERSITY: 'Boston University',
  CALIFORNIA_POLYTECHNIC_STATE_UNIVERSITY:
    'California Polytechnic State University',
  MCGILL_UNIVERSITY: 'McGill University',
  UNIVERSITY_OF_MARYLAND_COLLEGE_PARK: 'University of Maryland, College Park',
  UNIVERSITY_OF_TENNESSEE_KNOXVILLE: 'University of Tennessee, Knoxville',
  UNIVERSITY_OF_MICHIGAN: 'University of Michigan',
  CARLETON_COLLEGE: 'Carleton College',
  NEW_YORK_UNIVERSITY: 'New York University',
};

const Member = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  oauthID: { type: String, unique: true, sparse: true },
  email: { type: String, default: null, unique: true },
  chapter: {
    type: String,
    enum: Object.values(chapterEnum),
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(roleEnum),
    required: true,
  },
  gradYear: { type: Number, required: true },
  yearJoined: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(statusEnum),
    required: true,
  },
  yearLeft: {
    type: Number,
    default: null,
    required: function () {
      return this.status === statusEnum.RETIRED;
    },
  },
  publiclyVisible: { type: Boolean, required: true },
  linkedin: { type: String, default: null },
  github: { type: String, default: null },
  level: {
    type: String,
    enum: Object.values(levelEnum),
    default: levelEnum.MEMBER,
  },
  notes: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Member', Member);
module.exports.levelEnum = levelEnum;
module.exports.chapterEnum = chapterEnum;
