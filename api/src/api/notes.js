const express = require('express');
const router = express.Router();
const Note = require('../models/notes');
const Member = require('../models/members');
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
const { encryptNote, decryptNote } = require('../utils/apiWrapper');

/**
 * returns member names and ids from valid received ids
 *
 * @param {Array<String>} ids
 * @returns {Array<Object>}
 */
const memberFromId = async (ids) => {
  const members = await Member.find(
    { _id: { $in: ids } },
    { firstName: 1, lastName: 1 },
  );
  
  const formattedMembers = {};
  // return derived full name and id from meber
  members.forEach(
    (member) =>
      (formattedMembers[member._id] = {
        memberId: member._id,
        name: `${member.firstName} ${member.lastName}`,
      }),
  );
  return formattedMembers;
};

router.get(
  '/labels',
  requireRegistered,
  errorWrap(async (req, res) => {
    res.status(200).json({
      success: true,
      result: Note.labelsEnum,
      message: 'Note labels retrieved successfully.',
    });
  }),
);

router.get(
  '/:notesId',
  requireRegistered,
  errorWrap(async (req, res) => {
    const note = await Note.findOne({
      _id: req.params.notesId,
      $or: [
        { 'metaData.access.viewableBy': { $in: [req.user._id.toString()] } },
        { 'metaData.access.editableBy': { $in: [req.user._id.toString()] } },
      ],
    }).lean();

    const memberIds = [
      ...note.metaData.access.viewableBy,
      ...note.metaData.access.editableBy,
      ...note.metaData.referencedMembers,
    ];
    const uniqueMemberIds = [...new Set(memberIds)];
    const formattedMembers = await memberFromId(uniqueMemberIds);

    // Replace all members ids with object that has id and name
    note.metaData.access.viewableBy = note.metaData.access.viewableBy.map(
      (member) => formattedMembers[member],
    );
    note.metaData.access.editableBy = note.metaData.access.editableBy.map(
      (member) => formattedMembers[member],
    );
    note.metaData.referencedMembers = note.metaData.referencedMembers.map(
      (member) => formattedMembers[member],
    );

    if (note.encrypt) {
      const partialEncryptionKey = req.user.oauthID + req.user.UIN;
      const authedCredentials = req.session.authedCredentials;
      const result = await decryptNote({
        authedCredentials,
        note,
        partialEncryptionKey,
      });

      if (result.error && !result.error.response)
        return res
          .status(500)
          .json({ success: false, message: 'encryption service is down' });
      if (result.error)
        return res
          .status(403)
          .json({ success: false, message: 'unauthorized' });

      note.content = result.data.note;

      if (result.data.newToken)
        req.session.authedCredentials.accessToken = result.data.newToken;
    }

    res.status(200).json({
      success: true,
      result: note,
    });
  }),
);

router.get(
  '/',
  requireRegistered,
  errorWrap(async (req, res) => {
    const filter = {
      'metaData.title': 1,
      'metaData.labels': 1,
      'metaData.referencedMembers': 1,
      'metaData.access.viewableBy': 1,
      'metaData.access.editableBy': 1,
    };

    const notes = await Note.find(
      {
        $or: [
          {
            'metaData.access.viewableBy': { $in: [req.user._id.toString()] },
          },
          {
            'metaData.access.editableBy': { $in: [req.user._id.toString()] },
          },
        ],
      },
      filter,
    ).lean();

    const memberIds = notes.flatMap((note) => [
      ...note.metaData.access.viewableBy,
      ...note.metaData.access.editableBy,
      ...note.metaData.referencedMembers,
    ]);
    const uniqueMemberIds = [...new Set(memberIds)];
    const formattedMembers = await memberFromId(uniqueMemberIds);

    notes.forEach((note) => {
      // Replace all members ids with object that has id and name
      note.metaData.access.viewableBy = note.metaData.access.viewableBy.map(
        (member) => formattedMembers[member],
      );
      note.metaData.access.editableBy = note.metaData.access.editableBy.map(
        (member) => formattedMembers[member],
      );
      note.metaData.referencedMembers = note.metaData.referencedMembers.map(
        (member) => formattedMembers[member],
      );
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

    if (req.body.encrypt) {
      const authedCredentials = req.session.authedCredentials;
      const note = req.body;
      const result = await encryptNote({
        authedCredentials,
        note,
      });

      if (!result.error.response)
        return res
          .status(500)
          .json({ success: false, message: 'encryption service is down' });
      if (result.error)
        return res
          .status(403)
          .json({ success: false, message: 'unauthorized' });

      data.content = result.data.note;

      if (result.data.newToken)
        req.session.authedCredentials.accessToken = result.data.newToken;
    }

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
      if (req.body.encrypt) {
        const authedCredentials = req.session.authedCredentials;
        const note = req.body;
        const result = await encryptNote({
          authedCredentials,
          note,
        });

        if (!result.error.response)
          return res
            .status(500)
            .json({ success: false, message: 'encryption service is down' });
        if (result.error)
          return res
            .status(403)
            .json({ success: false, message: 'unauthorized' });

        data.content = result.data.note;
        if (result.data.newToken)
          req.session.authedCredentials.accessToken = result.data.newToken;
      }

      const updatedNote = await Note.findByIdAndUpdate(
        req.params.notesId,
        { $set: data },
        { new: true, upsert: true },
      );

      return res.status(200).json({
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
