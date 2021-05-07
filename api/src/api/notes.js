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

/**
 * returns member names and ids from valid received ids
 *
 * @param {Array<String>} ids
 * @returns {Array<Object>}
 */
const memberFromId = async (ids) => {
  const memberPromises = ids
    // filters out invalid ids
    .filter((id) => !!id)
    // creates promises for each valid id
    .map((memberId) => Member.findById(memberId));

  // get member data
  const members = await Promise.all(memberPromises);

  // return derived full name and id from meber
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
    if (isAdmin(req.user)) {
      notes = await Note.find({}).lean();
    } else {
      notes = await Note.find({
        $or: [
          { 'metaData.access.viewableBy': { $in: [req.user._id.toString()] } },
          { 'metaData.access.editableBy': { $in: [req.user._id.toString()] } },
        ],
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
      result: output_notes,
    });
  }),
);

// GET /notes/labels
router.get(
  '/labels',
  requireRegistered,
  errorWrap(async (req, res) => {
    const notes = await Note.find({});
    const labelList = [];

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
      message: 'Notes retrieved successfully.',
    });
  }),
);

router.post(
  '/',
  requireLead,
  errorWrap(async (req, res) => {
    const memberID = req.user._id;
    const currentVersion = {
      date: Date.now(),
      action: Note.actions.CREATED,
      memberID,
    };
    if (req.body.metaData.versionHistory) {
      req.body.metaData.versionHistory.push(currentVersion);
    } else {
      req.body.metaData.versionHistory = [currentVersion];
    }

    // Automatically include the note creator as an editor
    req.body.metaData.access.editableBy.push(memberID.toString());

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
        { new: true, upsert: true },
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
