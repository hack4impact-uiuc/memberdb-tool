const { levelEnum } = require('../models/members');

// In this auth scheme, all "higher" levels will have permissions of
// lower levels when using isXXX or requireXXX. Thus by default, a
// lead is a member, a director is a lead, unless requireLevel is
// used directly with a different set of levels
const allLevels = [
  levelEnum.TBD,
  levelEnum.MEMBER,
  levelEnum.LEAD,
  levelEnum.DIRECTOR,
  levelEnum.ADMIN,
];

// Boolean checks for usage inside route
const hasLevel = (user, levels) => user && levels.includes(user.level);

const isRegistered = (user) => hasLevel(user, allLevels);
const isMember = (user) => hasLevel(user, allLevels.slice(1));
const isLead = (user) => hasLevel(user, allLevels.slice(2));
const isDirector = (user) => hasLevel(user, allLevels.slice(3));
const isAdmin = (user) => hasLevel(user, allLevels.slice(4));

// Middleware for authentication
const requireLevel = (levels) => (req, res, next) => {
  if (!hasLevel(req.user, levels)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  } else {
    next();
  }
};

const requireRegistered = requireLevel(allLevels);
const requireMember = requireLevel(allLevels.slice(1));
const requireLead = requireLevel(allLevels.slice(2));
const requireDirector = requireLevel(allLevels.slice(3));
const requireAdmin = requireLevel(allLevels.slice(4));

module.exports = {
  hasLevel,
  isRegistered,
  isMember,
  isLead,
  isDirector,
  isAdmin,
  requireLevel,
  requireRegistered,
  requireMember,
  requireLead,
  requireDirector,
  requireAdmin,
};
