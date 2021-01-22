/**
 * Schema representing notes
 */
const mongoose = require('mongoose');

const actions = {
  CREATED: 'CREATED',
  EDITED: 'EDITED',
};


const Notes = new mongoose.Schema({
  content: { type: String, default: null},
  metaData: {
    title: { type: String, default: null }, 
    labels: { type: [String], default: null },
    referencedMembers: { type: [MemberID], default: null},
    versionHistory: [{
        default: null,
        date: { type: Date, default: null},
        memberID: {type: MemberID, default: null},
        action: {
            type: String, 
            enum: Object.values(actions),
            default: actions.CREATED,
        },
    }],
    access: {
        viewableBy: {type: [MemberID], default: null},
        editableBy: {type: [MemberID], default: null},
    }
  },
});


module.exports = mongoose.model('Notes', Notes);
module.exports.actions = actions;
