const flatten = require('lodash/flatten');

const Note = require('../models/notes');
const Member = require('../models/members');
const { MEMBER_ALIASES } = require('../api/members');
const { isAdmin } = require('./auth');

// middleware to validate if user can edit
const validateEditability = async (req, res, next) => {
  // ADMIN level takes precedence
  if (isAdmin(req.user)) {
    next();
  }
  const note = await Note.findById(req.params.notesId);
  // Check if note was found
  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
    });
  }

  // Check if current user if allowed to edit
  if (!note.metaData.access.editableBy.includes(req.user._id.toString())) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  next();
};

// middleware to validate null cases of request parameters
const validateReqParams = (req, res, next) => {
  // Return bad request if params or the notesId param is null
  if (!req.params || !req.params.notesId) {
    return res.status(400).json({
      success: false,
      message: 'Bad request within request parameters',
    });
  }
  next();
};

// helper function to convert an alias to its ids
const convertAliasToIds = async (referencedIds) => {
  const cleanedIds = await Promise.all(
    referencedIds.map(async (idOrAlias) => {
      if (!(idOrAlias in MEMBER_ALIASES)) return idOrAlias;

      const roles = MEMBER_ALIASES[idOrAlias];
      const nestedIds = await Member.find(
        { role: { $in: roles }, status: 'ACTIVE' },
        { _id: 1 },
      );
      const ids = nestedIds.map((nestedId) => String(nestedId._id));

      return ids;
    }),
  );

  const flattenedIds = flatten(cleanedIds);
  return flattenedIds;
};

// middleware to parse the aliases into their respective IDs
const parseNoteAliases = async (req, res, next) => {
  const note = req.body;

  note.metaData.referencedMembers = [
    ...new Set(await convertAliasToIds(note.metaData.referencedMembers)),
  ];
  note.metaData.access.editableBy = [
    ...new Set(await convertAliasToIds(note.metaData.access.editableBy)),
  ];
  note.metaData.access.viewableBy = [
    ...new Set(await convertAliasToIds(note.metaData.access.viewableBy)),
  ];

  next();
};

module.exports = {
  validateEditability,
  validateReqParams,
  parseNoteAliases,
};
