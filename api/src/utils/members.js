const { difference, pick } = require('lodash');
const Member = require('../models/members');
const { isDirector } = require('../middleware/auth');

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
  phone: /^[1-9]\d{2}-\d{3}-\d{4}$/,
  gradYear: /^\d{4}$/,
  generationYear: /^\d{4}$/,
};

const errorMessages = {
  email: 'Please use a valid email',
  phone: 'Please format phone numbers as XXX-XXX-XXXX',
  gradYear: 'Please use a four digit graduation year',
  generationYear: 'Please use a four digit generation year',
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

/*
Filter a list of Members by publiclyVisible
@params: List of Member objects
@return: List of Member objects that are publicly visible.
*/
const getConsentingMembers = (members) => {
  return members.filter((member) => (member.publiclyVisible ? true : false));
};


module.exports = {
  allFields,
  getEditableFields,
  getViewableFields,
  filterViewableFields,
  validateField,
  validationFields,
  errorMessages,
  getConsentingMembers,
};
