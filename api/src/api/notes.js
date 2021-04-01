const express = require('express');
const router = express.Router();
const Note = require('../models/notes');
const errorWrap = require('../middleware/errorWrap');
const {
  requireRegistered,
  requireLead,
  isAdmin,
} = require('../middleware/auth');
const {
  validateEditability,
  validateReqParams,
} = require('../middleware/notes');

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {
    let notes;
    // Return all notes if Admin
    if (isAdmin(req.user)) {
      notes = await Note.find({});
    } else {
      notes = await Note.find({
        'metaData.access.viewableBy': { $in: [req.user._id.toString()] },
      });
    }

    // TODO: test if this loops across all objs or just creates array of 1 obj
    notes.forEach((note) => {
      // save last member ID who edited and append to notes object
      const lastEditedBy = note['metaData']['versionHistory']['id'];
      note['lastEditedBy'] = lastEditedBy;
    });
    res.status(200).json({
      success: true,
      result: notes,
    });
  }),
);

router.post(
  '/',
  requireLead,
  errorWrap(async (req, res) => {
    const note = await Note.create(req.body);
    res.status(200).json({
      success: true,
      result: note,
    });
  }),
);

router.put(
  '/:notesId',
  requireRegistered,
  validateEditability,
  validateReqParams,
  errorWrap(async (req, res) => {
    let data = { ...req.body };
    await Note.findByIdAndUpdate(
      req.params.notesId,
      { $set: data },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: 'Note successfully updated',
    });
  }),
);

router.delete(
  '/:notesId',
  requireRegistered,
  validateEditability,
  validateReqParams,
  errorWrap(async (req, res) => {
    await Note.findByIdAndRemove(req.params.notesId);
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  }),
);

module.exports = router;
