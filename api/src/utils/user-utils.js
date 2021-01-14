const Member = require('./../models/member');
const { isDirector } = require('../middleware/auth');

const difference = (arr, exclude) => arr.filter((el) => exclude.includes(el));

// All fields in Member
const allFields = Member.schema.paths;
// Fields that are never viewable
const sensitiveFields = ['oauthID', '__v'];
// Fields that non-directors cannot view for other users
// TODO: omit notes fields once they are added to the DB
const nonViewableFields = ['level', 'areDuesPaid'];
// Fields that non-directors cannot edit for themselves
const nonEditableFields = ['level', 'areDuesPaid'];

const getViewableFields = (currentUser, memberId) => {
  if (isDirector(currentUser)) {
    return allFields;
  } else if (currentUser.id == memberId) {
    return allFields;
  } else {
    return difference(allFields, nonViewableFields);
  }
};

const getEditableFields = (currentUser, memberId) => {
  if (isDirector(user)) {
    return allFields;
  } else if (currentUser.id == memberId) {
    return difference(allFields, nonEditableFields);
  } else {
    return []; // Non-directors can never edit other users' info
  }
};

const removeFields = (obj, fields) => {
  const objCopy = { ...obj };

  fields.forEach((field) => {
    delete objCopy[field];
  });

  return objCopy;
};

const filterViewableFields = (currentUser, member) => {
  const omitFields = [
    ...sensitiveFields,
    ...difference(allFields, getViewableFields(currentUser, member._id)),
    '_id',
  ];

  const filteredMember = {
    ...removeFields(member.toObject(), omitFields),
    id: member._id, // Rename member._id to member.id
  };

  return filteredMember;
};

module.exports = {
  getEditableFields,
  getViewableFields,
  filterViewableFields,
};
