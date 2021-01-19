const express = require('express');
const router = express.Router();
const Note = require('../models/');
const errorWrap = require('../middleware/errorWrap');
const {
  requireRegistered,
  requireLead,
  isAdmin,
} = require('../middleware/auth');

// middleware to validate if user can edit
const validateEditability = (req, res, next) => {
  // ADMIN level takes precedence
  if (isAdmin(req.user)) {
    next();
  }
  // TODO: uncomment line once note Scheme exists
  // const note = await Note.findById(req.params.notesId)
  // Check if note was found
  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found',
    });
  }
  // Check if current user if allowed to edit
  if (!note.editableBy.includes(req.user._id.toString())) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  next();
};

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {
    const notes = Note.find({ viewableBy: { $in: [req.user._id] } });
    return res.status(200).json({
      success: true,
      result: null,
    });
  }),
);

router.post(
  '/',
  requireLead,
  requireRegistered,
  errorWrap(async (req, res) => {
    const note = await Note.create(req.body);
    return res.status(200).json({
      success: true,
      result: note,
    });
  }),
);

router.put(
  '/:notesId',
  requireRegistered,
  validateEditability,
  errorWrap(async (req, res) => {
    let data = { ...req.body };
    // TODO: fix this
    await Note.findByIdAndUpdate(
      req.params.notesId,
      { $set: data },
      { new: true },
    );
    return res.status(200).json({
      success: true,
      message: 'Note successfully updated',
    });
  }),
);

router.delete(
  '/:notesId',
  requireRegistered,
  validateEditability,
  errorWrap(async (req, res) => {
    await Note.findByIdAndRemove(req.params.notesId);
    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  }),
);
