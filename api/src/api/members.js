const express = require('express');
const router = express.Router();
const Member = require('./../models/member');
const { levelEnum } = Member;
const errorWrap = require('../middleware/errorWrap');
const { requireRegistered, requireDirector } = require('../middleware/auth');
const { filterSensitiveInfo } = require('../utils/user-utils');

const validateMemberQuery = (req, res, next) => {
  // Middleware that verifies that fields to be inserted/updated actually
  // exist in the Member schema
  for (const field in req.body) {
    if (!Member.schema.paths[field]) {
      return res.status(400).json({
        success: false,
        message: `no such field ${field} in member`,
      });
    }
  }
  next();
};

const isDirector = (user) =>
  [levelEnum.ADMIN, levelEnum.DIRECTOR].includes(user.level);
// TODO: omit notes fields once they are added to the DB
const additionalOmitFields = (user) =>
  isDirector(user) ? [] : ['level', 'areDuesPaid'];

router.get(
  '/current',
  errorWrap(async (req, res) => {
    res.json({
      success: true,
      result: req.user ? filterSensitiveInfo(req.user) : null,
    });
  }),
);

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {
    const members = await Member.find({});
    const filteredMembers = members.map((member) =>
      filterSensitiveInfo(member, additionalOmitFields(req.user)),
    );

    res.json({
      success: true,
      result: filteredMembers,
    });
  }),
);

router.post(
  '/',
  requireDirector,
  validateMemberQuery,
  errorWrap(async (req, res) => {
    const member = await Member.create(req.body);
    return res.status(200).json({
      success: true,
      result: member,
    });
  }),
);

router.get(
  '/:memberId',
  requireRegistered,
  errorWrap(async (req, res) => {
    const member = await Member.findOne({ _id: req.params.memberId });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'member not found with id',
      });
    }

    res.json({
      success: true,
      result: filterSensitiveInfo(member, additionalOmitFields(req.user)),
    });
  }),
);

router.put(
  '/:memberId',
  requireDirector,
  validateMemberQuery,
  errorWrap(async (req, res) => {
    const origMember = await Member.findByIdAndUpdate(
      req.params.memberId,
      req.body,
      { runValidators: true },
    );

    if (!origMember) {
      return res.status(404).json({
        success: false,
        message: 'member not found with id',
      });
    }

    res.json({
      success: true,
      message: 'member updated',
    });
  }),
);

module.exports = router;
