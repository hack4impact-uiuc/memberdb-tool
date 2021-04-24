const express = require('express');
const router = express.Router();
const Note = require('../models/notes');
const Member = require('../models/member');
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

const memberFromId = async (ids) => {
  const memberPromises = ids.map((memberId) => Member.findById(memberId));

  const members = await Promise.all(memberPromises);

  return members.map((member) => ({
    memberId: member._id,
    name: `${member.firstName} ${member.lastName}`,
  }));
};

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {
    let notes;
    const output_notes = [];

    // Return all notes if Admin
    if (isAdmin(req.user)) {
      notes = await Note.find({}).lean();
    } else {
      notes = await Note.find({
        'metaData.access.viewableBy': { $in: [req.user._id.toString()] },
      }).lean();
    }

    for (let note of notes) {
      // Replace all members ids with object that has id and name
      note['metaData']['access']['viewableBy'] = await memberFromId(
        note['metaData']['access']['viewableBy'],
      );
      note['metaData']['access']['editableBy'] = await memberFromId(
        note['metaData']['access']['editableBy'],
      );
      note['metaData']['referencedMembers'] = await memberFromId(
        note['metaData']['referencedMembers'],
      );

      output_notes.push(note);
    }

    res.status(200).json({
      success: true,
      result: output_notes,
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
    req.body.metaData.versionHistory.push({
      date: Date.now(),
      action: Note.actions.CREATED,
      memberID: req.user._id,
    });

    const note = await Note.create(req.body);
    res.status(200).json({
      success: true,
      result: note,
    });
  }),
);

const getVersionHistory = async (id) => {
  const note = await Note.findById(id);
  return note.metaData.versionHistory;
};

router.put(
  '/:notesId',
  requireRegistered,
  validateEditability,
  validateReqParams,
  errorWrap(async (req, res) => {
    let data = { ...req.body };

    // Get current version history and append latest edit
    const currentVersionHistory = await getVersionHistory(req.params.notesId);
    if (currentVersionHistory) {
      currentVersionHistory.push({
        date: Date.now(),
        action: Note.actions.EDITED,
        memberID: req.user._id,
      });

      data.metaData.versionHistory = currentVersionHistory;

      const updatedNote = await Note.findByIdAndUpdate(
        req.params.notesId,
        { $set: data },
        { new: true },
      );

      res.status(200).json({
        success: true,
        message: 'Note successfully updated',
        data: updatedNote,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No note with that id',
      });
    }
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
