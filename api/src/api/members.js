const express = require('express');
const router = express.Router();
const { Member, chapterEnum } = require('../models/members');
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

const validateMemberQuery = (multiple = false) => {
  return (req, res, next) => {
    // Middleware that verifies that fields to be inserted/updated actually
    // exist in the Member schema, and that user has permission to update them
    const users = multiple ? req.body.users : req.body;
    const editableFields = getEditableFields(req.user, req.params.memberId);

    function validateUser(user) {
      for (const field in user) {
        if (!allFields.includes(field)) {
          return {
            success: false,
            message: `No such field ${field} in member`,
          };
        }

        if (!editableFields.includes(field)) {
          return {
            success: false,
            message: `Cannot update protected field ${field} in member`,
          };
        }

        if (!validateField(field, user[field], validationFields)) {
          return {
            success: false,
            message: `${field} is formatted incorrectly`,
          };
        }
      }
      return null;
    }

    // If multiple users need to be tested
    if (Array.isArray(users)) {
      for (const user of users) {
        const errorMessage = validateUser(user);
        if (errorMessage) return res.end(JSON.stringify(errorMessage));
      }
    } else {
      const errorMessage = validateUser(users);
      if (errorMessage) return res.end(JSON.stringify(errorMessage));
    }
    next();
  };
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

// Create a new member
// Requires Director Level
router.post(
  '/',
  requireDirector,
  validateMemberQuery(),
  errorWrap(async (req, res) => {
    const member = await Member.create(req.body);
    return res.status(200).json({
      success: true,
      result: member,
    });
  }),
);

router.post(
  '/addMany',
  requireDirector,
  validateMemberQuery(true),
  errorWrap(async (req, res) => {
    const newMembers = [];
    for (const user of req.body.users) {
      newMembers.push(await Member.create(user));
    }
    return res.status(200).json({
      success: true,
      result: newMembers,
    });
  }),
);

router.delete(
  '/:memberId',
  requireDirector,
  validateMemberQuery(),
  errorWrap(async (req, res) => {
    const member = await Member.findByIdAndDelete(req.params.memberId);
    if (!member) {
      return res.status(200).json({
        success: false,
        message: 'Member not found with id',
      });
    }
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
  validateMemberQuery(),
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

// Gets all members associated with a given chapter
router.get(
  '/chapter/:chapter',
  requireRegistered,
  errorWrap(async (req, res) => {
    if (!Object.keys(Member.chapterEnum).includes(req.params.chapter)) {
      return res.status(404).json({
        success: false,
        message: req.params.chapter + ' is not a valid chapter.',
      });
    }
    res.json({
      success: true,
      result: Member.find({ chapter: Member.chapterEnum[req.params.chapter] }),
    });
  }),
);

router.get(
  '/role/:role/:chapter?',
  requireRegistered,
  errorWrap(async (req, res) => {
    let members = await Member.find({ role: req.params.role });
    if (req.params.chapter) {
      if (!Object.values(chapterEnum).includes(req.params.chapter)){
        return res.status(404).json({
          success: false,
          message: req.params.chapter + ' is not a valid chapter.',
        })
      }
      members = await Member.find({ role: req.params.role, chapter: req.params.chapter });
    }
    if (!members) {
      return res.status(404).json({
        success: false,
        message: req.params.role + ' is not a valid role.',
      })
    }
    res.json({
      success: true,
      result: members,
    });
  }),
);

module.exports = router;
