const { difference, pick } = require('lodash');
const Member = require('./../models/member');
const { isDirector } = require('../middleware/auth');

// Fields that are never viewable
const sensitiveFields = ['oauthID', '__v'];
// All fields in Member, except sensitive fields
const allFields = difference(Object.keys(Member.schema.paths), sensitiveFields);
// Fields that non-directors cannot view for other users
// TODO: omit notes fields once they are added to the DB
const nonViewableFields = ['level', 'areDuesPaid'];
// Fields that non-directors cannot edit for themselves
const nonEditableFields = ['level', 'areDuesPaid'];

const getViewableFields = (currentUser, memberId) => {
  if (isDirector(currentUser)) {
    return allFields;
  } else if (currentUser._id == memberId) {
    return allFields;
  } else {
    return difference(allFields, nonViewableFields);
  }
};

const getEditableFields = (currentUser, memberId) => {
  if (isDirector(user)) {
    return allFields;
  } else if (currentUser._id == memberId) {
    return difference(allFields, nonEditableFields);
  } else {
    return []; // Non-directors can never edit other users' info
  }
};

const filterViewableFields = (currentUser, member) => {
  const viewable = getViewableFields(currentUser, member._id);
  const filteredMember = pick(member.toObject(), viewable);
  // Rename _id to id
  filteredMember.id = filteredMember._id;
  delete filteredMember._id;

  return filteredMember;
};

module.exports = {
  getEditableFields,
  getViewableFields,
  filterViewableFields,
};
