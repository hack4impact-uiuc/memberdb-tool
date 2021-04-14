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
  const memberPromises = ids.map(
    (memberId) => {
      return Member.findById(memberId);
    } 
  )

  const members = await Promise.all(memberPromises);
  
  return members.map(member => ({
    memberId: member._id, 
    name: `${member.firstName} ${member.lastName}` 
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
      // save last member ID who edited and append to notes object
      note.metaData.lastEditedBy =
        note['metaData']['versionHistory'][
          note['metaData']['versionHistory'].length - 1
        ]['memberID'];

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
