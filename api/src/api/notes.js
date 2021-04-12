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

const replaceIdWithMember = async (ids) => {
  let memberArray = [];
  for (let memberId of ids) {
    const member = await Member.findById(memberId);
    memberArray.push({
      memberId: memberId,
      name: member.firstName + ' ' + member.lastName,
    });
  }
  return memberArray;
};

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {
    let notes;
    let output_notes = [];
    // Return all notes if Admin
    if (isAdmin(req.user)) {
      notes = await Note.find({}).lean();
    } else {
      notes = await Note.find({
        'metaData.access.viewableBy': { $in: [req.user._id.toString()] },
      }).lean();
    }

    for (let note of notes) {
      // save last member ID who edited and append to notes object
      note.metaData.lastEditedBy =
        note['metaData']['versionHistory'][
          note['metaData']['versionHistory'].length - 1
        ]['memberID'];

      // Replace all members ids with object that has id and name
      note['metaData']['access']['viewableBy'] = await replaceIdWithMember(
        note['metaData']['access']['viewableBy'],
      );
      note['metaData']['access']['editableBy'] = await replaceIdWithMember(
        note['metaData']['access']['editableBy'],
      );
      note['metaData']['referencedMembers'] = await replaceIdWithMember(
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
