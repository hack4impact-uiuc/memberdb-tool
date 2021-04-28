const { difference, pick } = require('lodash');
const imgur = require('imgur');
const Member = require('./../models/member');
const { isDirector } = require('../middleware/auth');

// Setup imgur client key
imgur.setClientId(process.env.IMGUR_CLIENT);

// All fields in Member
const allFields = Object.keys(Member.schema.paths);
// Fields that are never viewable
const neverViewableFields = ['oauthID', '__v'];
// Fields that are never editable
const neverEditableFields = ['_id', 'oauthID', '__v'];
// Fields that non-directors cannot view for other users
const nonViewableFields = ['areDuesPaid'];
// Fields that non-directors cannot edit for themselves
const nonEditableFields = [
  'email',
  'level',
  'areDuesPaid',
  'gradYear',
  'gradSemester',
  'classStanding',
  'generationYear',
  'generationSemester',
  'location',
  'role',
  'status',
];
// Fields and their regex for validation
const validationFields = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  phone: /^[0-9]{10}$/,
  gradYear: /^\d{4}/,
  generationYear: /^\d{4}/,
};

const getViewableFields = (currentUser, memberId) => {
  const viewableFields = difference(allFields, neverViewableFields);
  if (isDirector(currentUser)) {
    return viewableFields;
  } else if (currentUser._id.toString() === memberId) {
    return viewableFields;
  } else {
    return difference(viewableFields, nonViewableFields);
  }
};

const getEditableFields = (currentUser, memberId) => {
  const editableFields = difference(allFields, neverEditableFields);
  if (isDirector(currentUser)) {
    return editableFields;
  } else if (currentUser._id.toString() === memberId) {
    return difference(editableFields, nonEditableFields);
  } else {
    return []; // Non-directors can never edit other users' info
  }
};

const filterViewableFields = (currentUser, member) => {
  const viewable = getViewableFields(currentUser, member._id.toString());
  const filteredMember = pick(member.toObject(), viewable);
  return filteredMember;
};

const validateField = (field, value, validatingFields) => {
  if (field in validatingFields) {
    return validatingFields[field].test(value);
  }
  return true;
};

module.exports = {
  allFields,
  getEditableFields,
  getViewableFields,
  filterViewableFields,
  validateField,
  validationFields,
  imgur,
};
