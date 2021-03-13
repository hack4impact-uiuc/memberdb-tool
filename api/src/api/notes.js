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
      notes = [...Note.find({})];
    } else {
      // TODO: check if viewableBy path must be changed
      notes = [
        ...Note.find({ viewableBy: { $in: [req.user._id.toString()] } }),
      ];
    }
    // TODO: test if this loops across all objs or just creates array of 1 obj
    notes.forEach((note) => {
      // remove content from notes
      delete note['content'];
      // save last member ID who edited and append to notes object
      const lastEditedBy = note['metadata']['versionHistory']['actionBy'].pop();
      note['lastEditedBy'] = lastEditedBy;
      // remove versionHistory from notes
      delete note['metadata']['versionHistory'];
      // remove access info from notes
      delete note['metadata']['access'];
    });
    res.status(200).json({
      success: true,
      result: notes,
    });
  }),
);

//GET /notes/labels
router.get(
  '/labels',
  requireRegistered,
  errorWrap(async (req, res) => {
    const notes = await Note.find({});
    let labelList = [];

    for (const note of notes) {
      for (const label of note.metaData.labels) {
        if (!labelList.includes(label)) {
          labelList.push(label);
        }
      }
    }

    res.status(200).json({
      success: true,
      result: labelList,
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
