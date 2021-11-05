/**
 * Schema representing notes
 */
const mongoose = require('mongoose');

const actions = Object.freeze({
  CREATED: 'CREATED',
  EDITED: 'EDITED',
});

const labelsEnum = [
  '1:1',
  '2:1',
  '2:2',
  'Midpoint Reflection',
  'Final Reflection',
  'Lead Interview',
  'Director Interview',
  'Meeting',
  'Other',
];

const Notes = new mongoose.Schema({
  encrypt: { type: Boolean, default: false },
  content: { type: String, default: null },
  metaData: {
    title: { type: String, default: null },
    labels: [{ type: String, enum: labelsEnum }],
    referencedMembers: { type: [String], default: [] },
    versionHistory: [
      {
        default: [],
        date: { type: Date, default: null },
        memberID: { type: String, default: null },
        action: {
          type: String,
          enum: Object.values(actions),
          default: actions.CREATED,
        },
      },
    ],
    access: {
      viewableBy: { type: [String], default: [] },
      editableBy: { type: [String], default: [] },
    },
  },
});

module.exports = mongoose.model('Notes', Notes);
module.exports.actions = actions;
module.exports.labelsEnum = labelsEnum;
