const express = require('express');
const router = express.Router();
const Member = require('./../models/member');
const errorWrap = require('../middleware/errorWrap');
const { requireRegistered, requireDirector } = require('../middleware/auth');
const {
  filterViewableFields,
  getEditableFields,
} = require('../utils/user-utils');

const validateMemberQuery = (req, res, next) => {
  // Middleware that verifies that fields to be inserted/updated actually
  // exist in the Member schema, and that user has permission to update them
  const editableFields = getEditableFields(req.user, req.params.memberId);

  for (const field in req.body) {
    if (!allMemberFields.hasOwnProperty(field)) {
      return res.status(400).json({
        success: false,
        message: `No such field ${field} in member`,
      });
    }

    if (!editableFields.includes(field)) {
      return res.status(401).json({
        success: false,
        message: `Cannot update protected field ${field} in member`,
      });
    }
  }
  next();
};

router.get(
  '/current',
  errorWrap(async (req, res) => {
    res.json({
      success: true,
      result: req.user ? filterViewableFields(req.user, req.user) : null,
    });
  }),
);

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {
    const members = await Member.find({});
    const filteredMembers = members.map((member) =>
      filterViewableFields(req.user, member),
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
    const member = await Member.findById(req.params.memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found with id',
      });
    }

    res.json({
      success: true,
      result: filterViewableFields(req.user, member),
    });
  }),
);

router.get(
  '/:memberId/permissions',
  requireRegistered,
  errorWrap(async (req, res) => {
    res.json({
      success: true,
      result: {
        view: getViewableFields(req.user, req.params.memberId),
        edit: getEditableFields(req.user, req.params.memberId),
      },
    });
  }),
);

router.put(
  '/:memberId',
  requireRegistered,
  validateMemberQuery,
  errorWrap(async (req, res) => {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.memberId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedMember) {
      return res.status(404).json({
        success: false,
        message: 'Member not found with id',
      });
    }

    res.json({
      success: true,
      message: 'Member updated',
      result: updatedMember,
    });
  }),
);

module.exports = router;
