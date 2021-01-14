const { levelEnum } = require('../models/member');

const requireLevel = (levels) => (req, res, next) => {
  if (!req.user || !levels.includes(req.user.level)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  } else {
    next();
  }
};

const requireRegistered = requireLevel(Object.values(levelEnum));

const requireMember = requireLevel([
  levelEnum.ADMIN,
  levelEnum.DIRECTOR,
  levelEnum.LEAD,
  levelEnum.MEMBER,
]);

const requireLead = requireLevel([
  levelEnum.ADMIN,
  levelEnum.DIRECTOR,
  levelEnum.LEAD,
]);

const requireDirector = requireLevel([levelEnum.ADMIN, levelEnum.DIRECTOR]);

const requireAdmin = requireLevel([levelEnum.ADMIN]);

module.exports = {
  requireLevel,
  requireRegistered,
  requireMember,
  requireLead,
  requireDirector,
  requireAdmin,
};
