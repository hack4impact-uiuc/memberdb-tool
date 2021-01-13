const removeFields = (obj, fields) => {
  const objCopy = { ...obj };

  fields.forEach((field) => {
    delete objCopy[field];
  });

  return objCopy;
};

const filterSensitiveInfo = (user) => {
  const userCopy = { ...user, id: user._id };
  return removeFields(userCopy, ['oauthID', '_id']);
};

module.exports = {
  filterSensitiveInfo,
};
