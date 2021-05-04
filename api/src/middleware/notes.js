const { isAdmin } = require('./auth');
const Note = require('../models/notes');

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
  console.log(note);
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

module.exports = {
  validateEditability,
  validateReqParams,
};
