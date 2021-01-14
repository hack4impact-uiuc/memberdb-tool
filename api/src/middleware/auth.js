const { levelEnum } = require('../models/member');

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
