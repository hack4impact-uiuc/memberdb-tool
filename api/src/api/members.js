const express = require('express');
const router = express.Router();
const Member = require('../models/members');
const errorWrap = require('../middleware/errorWrap');
const { requireRegistered, requireDirector } = require('../middleware/auth');
const {
  allFields,
  filterViewableFields,
  getViewableFields,
  getEditableFields,
  validateField,
  validationFields,
  errorMessages,
} = require('../utils/members');

const MEMBER_ALIASES = {
  'Co-Directors': ['CO_DIRECTOR'],
  Directors: [
    'CO_DIRECTOR',
    'COMMUNITY_DIRECTOR',
    'EXTERNAL_DIRECTOR',
    'TECH_DIRECTOR',
  ],
  Leads: [
    'ACADEMY_LEAD',
    'TECH_LEAD',
    'PRODUCT_RESEARCH_LEAD',
    'PRODUCT_MANAGER',
  ],
};

const validateMemberQuery = (req, res, next) => {
  // Middleware that verifies that fields to be inserted/updated actually
  // exist in the Member schema, and that user has permission to update them
  const editableFields = getEditableFields(req.user, req.params.memberId);

  for (const field in req.body) {
    if (!allFields.includes(field)) {
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

    if (!validateField(field, req.body[field], validationFields)) {
      return res.status(400).json({
        success: false,
        message: `${field} is formatted incorrectly`,
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

router.get(
  '/aliases',
  requireRegistered,
  errorWrap(async (req, res) => {
    res.json({
      success: true,
      result: Object.keys(MEMBER_ALIASES),
    });
  }),
);

// Create a new member
// Requires Director Level
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

// Gives the enum options to the frontend to populate the dropdown.
// The key in the 'options' object must be the same as the DB attribute.
router.get(
  '/options',
  requireRegistered,
  errorWrap(async (req, res) => {
    const options = {};
    Member.schema.eachPath((pathname, schemaType) => {
      const { enum: optionsEnum } = schemaType.options;
      if (optionsEnum) {
        options[pathname] = optionsEnum.map((option) => ({
          label: option,
          value: option,
        }));
      }
    });

    res.json({
      success: true,
      result: options,
    });
  }),
);

// Returns the types of all the schema properties for member. This allows the frontend
// to decide the best way to provide input for each attribute.
// Note: This will only work for non-nested fields
router.get(
  '/schema',
  requireRegistered,
  errorWrap(async (req, res) => {
    const schemaTypes = { Enum: [] };

    Member.schema.eachPath((pathname, schemaType) => {
      if (schemaTypes[schemaType.instance] == null)
        schemaTypes[schemaType.instance] = [];

      if (schemaType.enumValues != null && schemaType.enumValues.length > 0)
        schemaTypes['Enum'].push(pathname);
      else schemaTypes[schemaType.instance].push(pathname);
    });

    res.json({
      success: true,
      result: schemaTypes,
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

router.post(
  '/:memberId',
  errorWrap(async (req, res) => {
    if (req.body.secret !== process.env.SESSION_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Request is missing service secret',
      });
    }

    const member = await Member.findById(req.params.memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found with id',
      });
    }

    res.json({
      success: true,
      result: filterViewableFields(member, member),
    });
  }),
);

router.post(
  '/email/:email',
  errorWrap(async (req, res) => {
    if (req.body.secret !== process.env.SESSION_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Request is missing service secret',
      });
    }

    const member = await Member.findOne({ email: req.params.email });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found with email',
      });
    }

    res.json({
      success: true,
      result: filterViewableFields(member, member),
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
      result: filterViewableFields(req.user, updatedMember),
    });
  }),
);

module.exports = router;
module.exports.MEMBER_ALIASES = MEMBER_ALIASES;
