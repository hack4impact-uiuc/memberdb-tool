const removeFields = (obj, fields) => {
  const objCopy = { ...obj };

  fields.forEach((field) => {
    delete objCopy[field];
  });

  return objCopy;
};

const filterSensitiveInfo = (user, additionalFields = []) => {
  const omitFields = ['_id', 'oauthID', '__v', ...additionalFields];
  const filteredUser = {
    ...removeFields(user.toObject(), omitFields),
    id: user._id, // Rename user._id to user.id
  };

  return filteredUser;
};

module.exports = {
  filterSensitiveInfo,
};
